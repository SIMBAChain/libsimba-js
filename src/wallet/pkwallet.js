import Wallet from './wallet';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { SigningException, UserRejectedSigningException, WalletNotFoundException, WalletLockedException} from "../exceptions";

/**
 * libsimba-js Private Key Wallet implementation
 * Use when you already have access to the decrypted private key
 * Wraps the [ethersjs]{@link https://docs.ethers.io/ethers.js/html/} library.
 */
export default class PKWallet extends Wallet {
    /**
     * Use when you already have access to the decrypted private key
     * @param {string} [private_key] - The private key in hexidecimal format
     * @param {function} [signingConfirmation] -  - an optional callback for requesting user permission to sign a
     * transaction. Should resolve a promise with true for accept, and false (or reject) for reject.
     */
    constructor(private_key, signingConfirmation) {
        super(signingConfirmation);
        this.pk = private_key;
        this.wallet = EthersWallet(this.pk);
    }

    /**
     * @override
     * Unlock the wallet - noop for this wallet
     * @param {string} passkey - The pass key to unlock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving when the wallet is unlocked
     */
    unlockWallet(passkey, progressCB){
        return Promise.resolve();
    }

    /**
     * @override
     * Generate a wallet
     * @param {string} passkey - The pass key to lock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving with the private key when the wallet is created
     */
    generateWallet(progressCB){
        this.wallet = EthersWallet.createRandom();
        this.pk = this.wallet.privateKey;
        return Promise.resolve(this.pk);
    }

    /**
     * @override
     * Delete the wallet
     */
    deleteWallet(){}

    /**
     * @override
     * Check if a wallet exists
     * @return {boolean} - does the wallet exist
     */
    walletExists(){
        return !!this.pk && !!this.wallet;
    }

    /**
     * The mnemonic phrase for this wallet, or null if the mnemonic is unknown.
     * @return {string} - The mnemonic phrase for this wallet, or null if the mnemonic is unknown.
     */
    getMnemonic(){
        if(!this.walletExists()){
            throw new WalletNotFoundException("No wallet generated!")
        }
        if(!this.wallet) {
            throw new WalletLockedException("Wallet not unlocked!");
        }

        return this.wallet.mnemonic;
    }

    /**
     *
     * @param {string} passkey - Passkey to encrypt the wallet
     * @param {function} [progressCB] - An optional callback to monitor progress of encryption, calls with a value between 0-1
     * @returns {Promise<string>} A promise that resolves with the JSON wallet
     */
    getEncryptedJson(passkey, progressCB){
        if(!this.walletExists()){
            throw new WalletNotFoundException("No wallet generated!")
        }
        if(!this.wallet) {
            throw new WalletLockedException("Wallet not unlocked!");
        }

        return this.wallet.encrypt(passkey, progressCB);
    }

    /**
     * @protected
     * @override
     * Sign a transaction payload
     * @param {Object} payload - The transaction to sign
     * @returns {Promise<string>} - Returns a promise resolving to the signed transaction
     */
    sign(payload) {
        if(!this.walletExists()){
            throw new WalletNotFoundException("No wallet generated!")
        }
        if(!this.wallet) {
            throw new WalletLockedException("Wallet not unlocked!");
        }

        return this.signingConfirmation().then(allow=>{
            if(allow){
                const cleanedPayload = this.cleanPayload(payload);
                return this.wallet.signTransaction(cleanedPayload)
                    .catch(error=>{throw new SigningException("Failed to sign transaction", error)});
            }
            throw new UserRejectedSigningException("User rejected signing");
        });
    }

    /**
     * @private
     * Clean the payload before signing
     * @param {Object} payload - The transaction to clean
     * @returns {string} - The cleaned transaction
     */
    cleanPayload(payload){
        const allowedKeys = [ 'to','nonce','gasLimit','gasPrice', 'data','value','chainId'];

        let cleanedPayload = {};

        Object.keys(payload).forEach(key=>{
            if(allowedKeys.indexOf(key) >= 0){
                cleanedPayload[key] = payload[key];
                if((typeof payload[key] === 'string' || payload[key] instanceof String) &&
                    payload[key].startsWith('0x') &&
                    payload[key].length % 2 !== 0){
                    cleanedPayload[key] = payload[key].replace('0x', '0x0');
                    console.log(`Bad Hex - txn.${key} = ${payload[key]}, reformatted to ${cleanedPayload[key]}`);
                }
            }
        });

        return cleanedPayload;
    }

    /**
     * @override
     * Get the wallets address
     * @returns {Promise<string>} - Returns a promise resolving to the wallets address
     */
    getAddress(){
        return this.wallet.getAddress();
    }
}

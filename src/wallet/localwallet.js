import Wallet from './wallet';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { SigningException, UserRejectedSigningException, WalletNotFoundException, WalletLockedException} from "../exceptions";

/**
 * libsimba-js Local Wallet implementation
 * Stores the wallet as encrypted json within the browsers localstorage
 * Wraps the [ethersjs]{@link https://docs.ethers.io/ethers.js/html/} library.
 */
export default class LocalWallet extends Wallet {
    /**
     * Use a wallet stored in the browsers local storage
     * @param {function} [signingConfirmation] -  - an optional callback for requesting user permission to sign a
     * transaction. Should resolve a promise with true for accept, and false (or reject) for reject.
     */
    constructor(signingConfirmation) {
        super(signingConfirmation);
    }

    /**
     * Unlock the wallet
     * @param {string} passkey - The pass key to unlock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving when the wallet is unlocked
     */
    unlockWallet(passkey, progressCB){
        return EthersWallet.fromEncryptedJson(window.localStorage.getItem('localwallet'), passkey, progressCB)
            .then(wallet=>this.wallet = wallet);
    }

    /**
     * Generate a wallet
     * @param {string} passkey - The pass key to lock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving when the wallet is created
     */
    generateWallet(passkey, progressCB){
        this.wallet = EthersWallet.createRandom();
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    /**
     * Generate a wallet from an existing private key
     * @param {string} key - The existing private key
     * @param {string} passkey - The pass key to lock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving when the wallet is created
     */
    generateWalletFromPrivateKey(key, passkey, progressCB){
        this.wallet = new EthersWallet(key);
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    /**
     * Generate a wallet from a mnemonic
     * @param {string} mnemonic - The mnemonic
     * @param {string} passkey - The pass key to lock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving when the wallet is created
     */
    generateWalletFromMnemonic(mnemonic, passkey, progressCB){
        this.wallet = EthersWallet.fromMnemonic(mnemonic);
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    /**
     * Generate a wallet from a encrypted json (see
     * [ethers docs]{@link https://docs.ethers.io/ethers.js/html/api-wallet.html?highlight=fromencryptedjson})
     * @param {string} json - The json
     * @param {string} passkey - The pass key to lock the wallet
     * @param {function} [progressCB] - A callback, accepting a number between 0-1, indicating decryption progress
     * @returns {Promise} - Returns a promise resolving when the wallet is created
     */
    generateWalletFromEncryptedJson(json, passkey, progressCB){
        this.wallet = EthersWallet.fromEncryptedJson(mnemonic, passkey);
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    /**
     * Delete the wallet
     */
    deleteWallet(){
        window.localStorage.removeItem('localwallet');
    }

    /**
     * Check if a wallet exists
     * @return {boolean} - does the wallet exist
     */
    walletExists(){
        return !!window.localStorage.getItem('localwallet');
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
     * Get the wallets address
     * @returns {Promise<string>} - Returns a promise resolving to the wallets address
     */
    getAddress(){
        return this.wallet.getAddress();
    }
}

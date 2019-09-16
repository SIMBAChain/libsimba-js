import Wallet from './wallet';
import { Wallet as EthersWallet } from '@ethersproject/wallet';
import { SigningException, UserRejectedSigningException, WalletNotFoundException, WalletLockedException} from "../exceptions";

export default class LocalWallet extends Wallet {
    /**
     * Use a wallet stored in the browsers local storage
     * @param signingConfirmation - callback called before signing - useful to ask for user confirmation.
     *                                  Return a promise, resolving true to allow, false to deny. reject also denies
     */
    constructor(signingConfirmation) {
        super(signingConfirmation);
    }

    unlockWallet(passkey, progressCB){
        return EthersWallet.fromEncryptedJson(window.localStorage.getItem('localwallet'), passkey, progressCB)
            .then(wallet=>this.wallet = wallet);
    }

    generateWallet(passkey, progressCB){
        this.wallet = EthersWallet.createRandom();
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    generateWalletFromPrivateKey(key, passkey, progressCB){
        this.wallet = new EthersWallet(key);
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    generateWalletFromMnemonic(mnemonic, passkey, progressCB){
        this.wallet = EthersWallet.fromMnemonic(mnemonic);
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    generateWalletFromEncryptedJson(json, passkey, progressCB){
        this.wallet = EthersWallet.fromEncryptedJson(mnemonic, passkey);
        return this.wallet.encrypt(passkey, progressCB).then((json)=>{
            window.localStorage.setItem('localwallet', json);
            return true;
        });
    }

    deleteWallet(){
        window.localStorage.removeItem('localwallet');
    }

    walletExists(){
        return !!window.localStorage.getItem('localwallet');
    }

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
     * @param passkey - Passkey to encrypt the wallet
     * @param progressCB - An optional callback to monitor progress of encryption, calls with a value between 0-1
     * @returns {Promise<string> | Uint8Array | PromiseLike<ArrayBuffer>} A promise that resolves with the JSON wallet
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

    getAddress(){
        return this.wallet.getAddress();
    }
}

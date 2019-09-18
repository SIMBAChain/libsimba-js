/**
 * @interface
 * Base class for libsimba Wallet implementations
 */
export default class Wallet {
    /**
     * Base class for libsimba Wallet implementations
     * @param signingConfirmation {function} - an optional callback for requesting user permission to sign a
     * transaction. Should resolve a promise with true for accept, and false (or reject) for reject.
     */
    constructor(signingConfirmation) {
        if(!signingConfirmation){
            signingConfirmation = ()=>Promise.resolve(true);
        }
        this.signingConfirmation = signingConfirmation;
        if (this.constructor === Wallet) {
            throw new TypeError('Can not construct abstract class.');
        }

        if (this.unlockWallet === Wallet.prototype.unlockWallet) {
            throw new TypeError('Please implement abstract method unlockWallet.');
        }

        if (this.generateWallet === Wallet.prototype.generateWallet) {
            throw new TypeError('Please implement abstract method generateWallet.');
        }

        if (this.deleteWallet === Wallet.prototype.deleteWallet) {
            throw new TypeError('Please implement abstract method deleteWallet.');
        }

        if (this.walletExists === Wallet.prototype.walletExists) {
            throw new TypeError('Please implement abstract method walletExists.');
        }

        if (this.sign === Wallet.prototype.sign) {
            throw new TypeError('Please implement abstract method sign.');
        }

        if (this.getAddress === Wallet.prototype.getAddress) {
            throw new TypeError('Please implement abstract method getAddress.');
        }
    }

    /**
     * @abstract
     * (Abstract) Unlock the wallet
     * @param {string} passkey - The pass key to unlock the wallet
     * @returns {Promise} - Returns a promise resolving when the wallet is unlocked
     */
    unlockWallet(passkey) {
        throw new Error('Wallet.unlockWallet Not Implemented');
    }

    /**
     * @abstract
     * (Abstract) Generate a wallet
     * @param {string} passkey - The pass key to lock the wallet
     * @returns {Promise} - Returns a promise resolving when the wallet is created
     */
    generateWallet(passkey) {
        throw new Error('Wallet.unlockWallet Not Implemented');
    }

    /**
     * @abstract
     * (Abstract) Delete the wallet
     */
    deleteWallet() {
        throw new Error('Wallet.deleteWallet Not Implemented');
    }

    /**
     * @abstract
     * (Abstract) Check if a wallet exists
     * @return {boolean} - does the wallet exist
     */
    walletExists() {
        throw new Error('Wallet.deleteWallet Not Implemented');
    }

    /**
     * @protected
     * @abstract
     * (Abstract) Sign a transaction payload
     * @param {Object} payload - The transaction to sign
     * @returns {Promise<string>} - Returns a promise resolving to the signed transaction
     */
    sign(payload) {
        throw new Error('Wallet.sign Not Implemented');
    }

    /**
     * @abstract
     * (Abstract) Get the wallets address
     * @returns {Promise<string>} - Returns a promise resolving to the wallets address
     */
    getAddress(){
        throw new Error('Wallet.sign Not Implemented');
    }
}

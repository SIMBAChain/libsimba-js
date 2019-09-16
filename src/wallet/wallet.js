export default class Wallet {
    constructor(signingConfirmation) {
        if(!signingConfirmation){
            signingConfirmation = ()=>Promise.resolve(true);
        }
        this.signingConfirmation = signingConfirmation;
        if (this.constructor === Wallet) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError('Can not construct abstract class.');
        }

        if (this.sign === Wallet.prototype.sign) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError('Please implement abstract method sign.');
        }

        if (this.getAddress === Wallet.prototype.getAddress) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError('Please implement abstract method getAddress.');
        }
    }

    sign(payload) {
        throw new Error('Wallet.sign Not Implemented');
    }

    getAddress(){
        throw new Error('Wallet.sign Not Implemented');
    }
}

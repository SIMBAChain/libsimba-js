export class BaseException extends Error{
    constructor(message, cause){
        super();
        this.name = 'BaseException';
        this.message = message;
        this.cause = cause;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class GenerateTransactionException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'GenerateTransactionException';
    }
}

export class SubmitTransactionException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'SubmitTransactionException';
    }
}

export class TransactionStatusCheckException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'TransactionStatusCheckException';
    }
}

export class SigningException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'SigningException';
    }
}

export class UserRejectedSigningException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'UserRejectedSigningException';
    }
}

export class WalletNotFoundException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'WalletNotFoundException';
    }
}

export class WalletLockedException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'WalletLockedException';
    }
}


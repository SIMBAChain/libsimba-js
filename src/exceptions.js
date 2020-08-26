/**
 * Base exception that all libsimba Exceptions extend
 */
export class BaseException extends Error{
    /**
     * Base exception that all libsimba Exceptions extend
     * @param {string} message - the error message
     * @param {Error|string} [cause] - (Optional) wrap an existing error
     */
    constructor(message, cause){
        super();
        this.name = 'BaseException';

        if('response' in message){
            this.message = message.response.data;
            this.cause = cause || message;
        }else{
            this.message = message;
            this.cause = cause;
        }

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Thrown when a method that should be implemented is not
 */
export class NotImplementedException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'NotImplementedException';
    }
}

/**
 * Thrown when a method on a class inheriting [SimbaBase]{@link SimbaBase} is called before
 * metadata is retrieved.
 */
export class MissingMetadataException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'MissingMetadataException';
    }
}

/**
 * Thrown when metadata doesn't have something it should have
 */
export class BadMetadataException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'BadMetadataException';
    }
}

/**
 * Thrown when a method call isn't valid
 */
export class MethodCallValidationMetadataException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'MethodCallValidationMetadataException';
    }
}

/**
 * Thrown when the server fails to generate the transaction for signing
 */
export class GenerateTransactionException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'GenerateTransactionException';
    }
}

/**
 * Thrown when the server returns an error after submitting a signed transaction
 */
export class SubmitTransactionException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'SubmitTransactionException';
    }
}

/**
 * Thrown when the server returns an error when querying transactions
 */
export class GetRequestException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'GetRequestException';
    }
}

/**
 * Thrown when the server returns an error when querying transactions
 */
export class PostRequestException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'PostRequestException';
    }
}

/**
 * Thrown when the server returns an error when querying transactions
 */
export class GetTransactionsException extends GetRequestException{
    constructor(...args){
        super(...args);
        this.name = 'GetTransactionsException';
    }
}

/**
 * Thrown when an error occurs checking a transactions status
 */
export class TransactionStatusCheckException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'TransactionStatusCheckException';
    }
}

/**
 * Thrown when there's an error signing a transaction
 */
export class SigningException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'SigningException';
    }
}

/**
 * Thrown when a LocalWallet is created in a non browser environment
 */
export class NotInBrowserException extends BaseException{
    constructor(...args){
        super(...args);
        this.name = 'NotInBrowserException';
    }
}

/**
 * Thrown when the user rejects the request to sign
 */
export class UserRejectedSigningException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'UserRejectedSigningException';
    }
}

/**
 * Thrown when a method on a class inheriting [SimbaBase]{@link SimbaBase} is called that requires
 * a [Wallet]{@link Wallet} to be set, and it isn't.
 */
export class WalletNotFoundException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'WalletNotFoundException';
    }
}

/**
 * Thrown when a method on a class inheriting [SimbaBase]{@link SimbaBase} is called that requires
 * a [Wallet]{@link Wallet} to be unlocked, and it isn't.
 */
export class WalletLockedException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'WalletLockedException';
    }
}

/**
 * Thrown when a method call exceeds the max retries
 */
export class RetriesExceededException extends SigningException{
    constructor(...args){
        super(...args);
        this.name = 'RetriesExceededException';
    }
}


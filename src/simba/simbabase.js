import {pollWrapper} from "poll-js";
import {MissingMetadataException, NotImplementedException, BadMetadataException, MethodCallValidationMetadataException} from '../exceptions';

/**
 * Base class for libsimba API Interaction implementations
 */
export default class SimbaBase {
    /**
     * Base class for libsimba API Interaction implementations
     * @param {string} endpoint - The endpoint of the API
     * @param {Wallet} [wallet] - an optional {@link Wallet} instance
     */
    constructor(endpoint, wallet) {
        if (!endpoint.endsWith('/')) {
            this.endpoint = `${endpoint}/`;
        } else {
            this.endpoint = endpoint;
        }
        this.wallet = wallet;

        this.metadata = {};

        if (this.constructor === SimbaBase) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError('Can not construct abstract class.');
        }

        if (this.initialize === SimbaBase.prototype.initialize) {
            throw new NotImplementedException('Please implement abstract method callMethod.');
        }

        if (this.callMethod === SimbaBase.prototype.callMethod) {
            throw new NotImplementedException('Please implement abstract method callMethod.');
        }

        if (this.getTransactionStatus === SimbaBase.prototype.getTransactionStatus) {
            throw new NotImplementedException('Please implement abstract method getTransactionStatus.');
        }

        if (this.checkTransactionStatusFromObject === SimbaBase.prototype.checkTransactionStatusFromObject) {
            throw new NotImplementedException('Please implement abstract method checkTransactionStatusFromObject.');
        }

        if (this.checkTransactionDone === SimbaBase.prototype.checkTransactionDone) {
            throw new NotImplementedException('Please implement abstract method checkTransactionDone.');
        }

        if (this.checkTransactionStatus === SimbaBase.prototype.checkTransactionStatus) {
            throw new NotImplementedException('Please implement abstract method checkTransactionStatus.');
        }

        if (this.getBalance === SimbaBase.prototype.getBalance) {
            throw new NotImplementedException('Please implement abstract method getBalance.');
        }

        if (this.addFunds === SimbaBase.prototype.addFunds) {
            throw new NotImplementedException('Please implement abstract method addFunds.');
        }
    }

    /**
     * (Abstract) Perform any asynchronous actions needed to initialise this class
     */
    initialize() {
        throw new NotImplementedException('SimbaBase.initialize Not Implemented');
    }

    /**
     * (Abstract) Call a method on the API
     * @param {string} method - the method to call
     * @param {Object} parameters - the parameters for the method
     * @return {Promise} - a promise resolving with the transaction details
     */
    callMethod(method, parameters) {
        throw new NotImplementedException('SimbaBase.callMethod Not Implemented');
    }

    /**
     * (Abstract) Call a method on the API with files
     * @param {string} method - the method to call
     * @param {Object} parameters - the parameters for the method
     * @param {Array} files - the files
     * @return {Promise<Object>} - a promise resolving with the transaction details
     */
    callMethodWithFile(method, parameters, files) {
        throw new NotImplementedException('SimbaBase.callMethod Not Implemented');
    }

    /**
     * (Abstract) Get the status of a transaction by ID
     * @param {string} txnId - the transaction ID
     * @return {Promise<Object>} - a promise resolving with the transaction details
     */
    getTransactionStatus(txnId){
        throw new NotImplementedException('SimbaBase.getTransactionStatus Not Implemented');
    }

    /**
     * (Abstract) Gets the status of a transaction
     * @param {Object} txn - a transaction object
     * @return {Object} - an object with status details
     */
    checkTransactionStatusFromObject(txn){
        throw new NotImplementedException('SimbaBase.checkTransactionStatusFromObject Not Implemented');
    }

    /**
     * (Abstract) Check if the transaction is complete
     * @param {Object} txn - the transaction object
     * @return {boolean} - is the transaction complete
     */
    checkTransactionDone(txn){
        throw new NotImplementedException('SimbaBase.checkTransactionDone Not Implemented');
    }

    /**
     * (Abstract) Gets the status of a transaction by ID
     * @param {string} txnId - a transaction ID
     * @return {Object} - an object with status details
     */
    checkTransactionStatus(txnId){
        throw new NotImplementedException('SimbaBase.checkTransactionStatus Not Implemented');
    }

    /**
     * (Abstract) Get the balance for the attached Wallet
     * @return {Promise<Object>} - the balance
     */
    getBalance(){
        throw new NotImplementedException('SimbaBase.getBalance Not Implemented');
    }

    /**
     * (Abstract) Add funds to the attached Wallet.
     * Please check the output of this method. It is of the form
     * ```
     * {
     *     txnId: null,
     *     faucet_url: null,
     *     poa: true
     * }
     * ```
     *
     * If successful, txnId will be populated.
     * If the network is PoA, then poa will be true, and txnId will be null
     * If the faucet for the network is external (e.g. Rinkeby, Ropsten, etc), then txnId will be null,
     * and faucet_url will be populated with a URL. You should present this URL to your users to direct them
     * to request funds there.
     * @return {Promise<Object>} - details of the txn
     */
    addFunds(){
        throw new NotImplementedException('SimbaBase.addFunds Not Implemented');
    }

    /**
     * Returns an object with 'future' and 'cancel' keys.
     * future is the promise to listen on for the response or an error.
     * cancel is a function - call it to cancel the polling.
     * @param {string} txnId - the transaction ID
     * @param {number} [pollInterval=5000] - the interval in ms for polling
     */
    waitForSuccessOrError(txnId, pollInterval){
        if(!pollInterval) pollInterval = 5000;

        return pollWrapper({
            request: () => this.getTransactionStatus(txnId),
            pollingPeriod: pollInterval, // ms
            shouldStop: (txn)=> this.checkTransactionDone(this.checkTransactionStatusFromObject(txn))
        });
    }

    /**
     * Set the wallet
     * @param {Wallet} wallet - the wallet
     */
    setWallet(wallet){
        this.wallet = wallet;
    }

    /**
     * Set the API Key to authenticate calls
     * @param {string} apiKey - the API Key
     */
    setApiKey(apiKey){
        this.apiKey = apiKey;
    }

    /**
     * Set the API Key to authenticate management calls
     * @param {string} managementKey - the management API Key
     */
    setManagementKey(managementKey){
        this.managementKey = managementKey;
    }

    /**
     * Get API Call auth headers
     * @returns {{APIKEY: *, "Content-Type": string}}
     */
    apiAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            APIKEY: this.apiKey,
        }
    }

    /**
     * Get management API Call auth headers
     * @returns {{APIKEY: *, "Content-Type": string}}
     */
    managementAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            APIKEY: this.managementKey,
        }
    }

    /**
     * Validate the method call against the app metadata
     * @param {string} methodName - the methods name
     * @param {Object} parameters - the parameters for the method call
     * @param {Array} [files] - Optional array of files
     * @returns {boolean}
     * @throws {MissingMetadataException} - App Metadata not yet retrieved
     * @throws {BadMetadataException} - App Metadata doesn't have methods
     * @throws {MethodCallValidationMetadataException} - Method call fails validation
     */
    validateCall(methodName, parameters, files){
        if (!this.metadata) {
            throw new MissingMetadataException("App Metadata not yet retrieved");
        }

        if (!this.metadata.methods) {
            throw new BadMetadataException("App Metadata doesn't have methods!");
        }

        if(!(methodName in this.metadata.methods)){
            throw new MethodCallValidationMetadataException(`Method "${methodName}" not found`);
        }

        let methodMeta = this.metadata.methods[methodName];

        if(files && !('_files' in methodMeta.parameters)){
            throw new MethodCallValidationMetadataException(`Method "${methodName}" does not accept files`);
        }

        let paramNames = Object.keys(parameters);

        paramNames.forEach((key)=>{
            if(!(key in methodMeta.parameters)){
                throw new MethodCallValidationMetadataException(`Parameter "${key}" is not valid for method "${methodName}"`);
            }
            //TODO: Type checks
        });

        let missing = Object.keys(methodMeta.parameters).filter((key)=>key in paramNames);

        if(missing.length){
            throw new MethodCallValidationMetadataException(`Parameters [${missing.join(',')}] not present for method "${methodName}"`);
        }

        return true;
    }
}

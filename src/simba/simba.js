import SimbaBase from './simbabase';
import {
    WalletNotFoundException,
    MissingMetadataException,
    GenerateTransactionException,
    SubmitTransactionException,
    TransactionStatusCheckException,
    NotImplementedException,
    GetTransactionsException,
    GetRequestException,
    PostRequestException,
    RetriesExceededException
} from '../exceptions';
import PagedResponse from "./pagedresponse";
var FormData = require('form-data');
import axios from 'axios';

/**
 * libsimba API Interaction for Simbachain.com
 */
export default class Simbachain extends SimbaBase {
    /**
     * libsimba API Interaction for Simbachain.com
     * @param {string} endpoint - The endpoint of the API
     * @param {Wallet} [wallet] - an optional {@link Wallet} instance
     */
    constructor(endpoint, wallet) {
        super(endpoint, wallet);
    }

    /**
     * @private
     * Perform asynchronous actions needed to initialise this class
     */
    async initialize() {
        let response = await axios.request({
            url: `${this.endpoint}?format=openapi`,
            responseType: 'json'
        });
        let swagger = response.data;

        if ('info' in swagger && 'x-simba-attrs' in swagger.info) {
            this.metadata = swagger.info['x-simba-attrs'];
        }
    }

    /**
     * @override
     * Call a method on the API
     * @param {string} method - the method to call
     * @param {Object} parameters - the parameters for the method
     * @return {Promise} - a promise resolving with the transaction details
     */
    async callMethod(method, parameters) {
        if (!this.wallet) {
            throw new WalletNotFoundException("No Wallet found");
        }

        this.validateCall(method, parameters);

        let formData = new FormData();
        let address = await this.wallet.getAddress();
        formData.append('from', address);
        for (let [key, value] of Object.entries(parameters)) {
            formData.append(key, value);
        }

        return this.sendMethodRequest(method, formData);
    }

    /**
     * @override
     * Get the status of a transaction by ID
     * @param {string} txnId - the transaction ID
     * @return {Promise<Object>} - a promise resolving with the transaction details
     */
    getTransactionStatus(txnId) {
        return axios.request({
            url: `${this.endpoint}transaction/${txnId}/`,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            responseType: 'json'
        })
            .then(async (response) => {
                return response.data;
            })
            .catch(error=>{
                throw new TransactionStatusCheckException(JSON.stringify(error.response.data));
            });
    }

    /**
     * @override
     * @private
     * Gets the status of a transaction
     * @param {Object} txn - a transaction object
     * @return {Object} - an object with status details
     */
    checkTransactionStatusFromObject(txn) {
        let ret = {
            status: '',
            transaction_hash: ''
        };

        if (txn.transaction_hash) {
            ret.transaction_hash = txn.transaction_hash;
        }

        if (txn.error) {
            ret.status = 'error';
            ret.error = txn.error;
            ret.error_details = txn.error_details;
        } else if (!txn.receipt) {
            ret.status = 'pending';
        } else {
            ret.status = 'success';
        }

        return ret;
    }

    /**
     * @override
     * @private
     * Check if the transaction is complete
     * @param {Object} txn - the transaction object
     * @return {boolean} - is the transaction complete
     */
    checkTransactionDone(txn) {
        return txn.status !== 'pending';
    }

    /**
     * @override
     * @private
     * Gets the status of a transaction by ID
     * @param {string} txnId - a transaction ID
     * @return {Object} - an object with status details
     */
    checkTransactionStatus(txnId) {
        return this.getTransactionStatus(txnId)
            .then(this.checkTransactionStatusFromObject);
    }

    /**
     * @override
     * Get the balance for the attached Wallet
     * @return {Promise<Object>} - the balance
     */
    async getBalance() {
        if (!this.metadata) {
            throw new MissingMetadataException("App Metadata not yet retrieved");
        }

        if (!this.wallet) {
            throw new WalletNotFoundException("No Wallet found");
        }

        if (this.metadata.poa) {
            return Promise.resolve({
                amount: -1,
                currency: "",
                poa: true
            });
        }

        let address = await this.wallet.getAddress();
        let response = await axios.request(
            {
                url: `${this.endpoint}balance/${address}/`,
                method: 'GET',
                headers: Object.assign({'Content-Type':'application/json'},this.apiAuthHeaders()),
                responseType: 'json'
            }
        ).catch(error=>{
                throw new GetRequestException(JSON.stringify(error.response.data));
            });

        return Promise.resolve({
            ...response.data,
            poa: false
        });
    }

    /**
     * @override
     * Add funds to the attached Wallet.
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
    async addFunds() {
        if (!this.metadata) {
            throw new MissingMetadataException("App Metadata not yet retrieved");
        }

        if (!this.wallet) {
            throw new WalletNotFoundException("No Wallet found");
        }

        let address = await this.wallet.getAddress();

        if (this.metadata.poa) {
            return Promise.resolve({
                txnId: null,
                poa: true,
                faucet_url: null
            });
        }

        if (!this.metadata.simba_faucet) {
            return Promise.resolve({
                txnId: null,
                poa: false,
                faucet_url: this.metadata.faucet
            });
        }

        let requestData = {
            account: address,
            value: "1",
            currency: "ether"
        };

        let response = await axios.request(
            {
                url: `${this.endpoint}balance/${address}/`,
                method: 'POST',
                headers: Object.assign({'Content-Type':'application/json'}, this.apiAuthHeaders()),
                data: requestData,
                responseType: 'json'
            }
        ).catch(error=>{
            throw new PostRequestException(JSON.stringify(error.response.data));
        });


        return Promise.resolve({
            ...response.data,
            poa: false,
            faucet_url: null
        });
    }

    /**
     * @override
     * Call a method on the API with files
     * @param {string} method - the method to call
     * @param {Object} parameters- the parameters for the method
     * @param {Array<Blob|File>} files - the files
     * @return {Promise<Object>} - a promise resolving with the transaction details
     */
    async callMethodWithFile(method, parameters, files) {
        if (!this.wallet) {
            throw new WalletNotFoundException("No Wallet found");
        }

        this.validateCall(method, parameters, files);

        let formData = new FormData();
        let address = await this.wallet.getAddress();
        formData.append('from', address);
        for (let [key, value] of Object.entries(parameters)) {
            formData.append(key, value);
        }

        for(let i = 0; i < files.length; i++){
            formData.append(`file[${i}]`, files[i]);
        }

        return this.sendMethodRequest(method, formData);
    }

    /**
     * @private
     * Internal method for submitting method calls and retrying on nonce errors
     * @param {string} txnId - the txnId
     * @param {string} signed - The signed txn
     * @returns {Promise<Response>} - The response with transaction data
     */
    async submitTxn(txnId, payload, maxTries, currentTry){
        if(!maxTries) maxTries = 5;
        if(!currentTry) currentTry = 0;
        if(currentTry > maxTries){
            throw new RetriesExceededException();
        }
        // tslint:disable-next-line: no-unsafe-any
        const signed = await this.wallet.sign(payload);

        return axios.request({
            url: `${this.endpoint}transaction/${txnId}/`,
            method: 'POST',
            headers: Object.assign({'Content-Type':'application/json'},this.apiAuthHeaders()),
            data: {payload: signed},
            responseType: 'json'
        }).then(response => {
            // tslint:disable-next-line: no-console
            console.log('Success!', response.data);
            return txnId;
        }).catch(ex=>{
            let body = ex.response.data;
            if(body.errors && body.errors.length){
                let error = body.errors[0];
                if(error.detail && error.detail.code){
                    let code = error.detail.code;
                    //Nonce Error
                    if(code === "15001" && error.detail.meta && error.detail.meta.suggested_nonce){
                        console.log("Nonce Too Low, trying again with suggested nonce " + error.detail.meta.suggested_nonce);
                        payload.nonce = error.detail.meta.suggested_nonce;
                        return this.submitTxn(txnId, payload, maxTries, currentTry++);
                    }
                }
            }
            throw new SubmitTransactionException(JSON.stringify(body));
        });
    }

    /**
     * @private
     * Internal method for sending method calls
     * @param {string} url - the url
     * @param {object} formdata - Formdata for the POST
     * @returns {Promise<Response>} - The response with transaction data
     */
    async sendMethodRequest(method, formdata){
        let txnId = null;
        let payload;

        let headers = {};

        headers = Object.assign(headers,this.apiAuthHeaders());

        if(formdata.getHeaders){
            //For NodeJS
            headers = Object.assign(headers,formdata.getHeaders());
        }

        return axios.request({
            url: `${this.endpoint}${method}/`,
            method: 'POST',
            headers: headers,
            data: formdata,
            responseType: 'json'
        })
            .then((response) => {
                // tslint:disable-next-line: no-unsafe-any
                txnId = response.data.id;
                // tslint:disable-next-line: no-unsafe-any

                payload = response.data.payload.raw;

                return this.submitTxn(txnId, payload);
            })
            .catch(ex=>{
                throw new GenerateTransactionException(JSON.stringify(ex.response.data));
            });
    }

    /**
     * @override
     * Gets a specific transaction
     * @param {string} transactionIdOrHash - Either a transaction ID or a transaction hash
     * @returns {Promise<Object>} - The transaction
     */
    async getTransaction(transactionIdOrHash) {
        this.validateAnyGetCall();

        let url = new URL(`${this.endpoint}transaction/${transactionIdOrHash}/`);

        let response = await axios.request({
            url: url,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            responseType: 'json'
        })
            .catch(ex=>{
                throw new GetTransactionsException(ex.response.data);
            });

        return response.data;
    }

    /**
     * @override
     * Gets a paged list of transactions
     * @param {Object} parameters - The query parameters
     * @returns {Promise<PagedResponse>} - A response wrapped in a {@link PagedResponse} helper
     */
    async getTransactions(parameters) {
        this.validateAnyGetCall();

        let url = new URL(`${this.endpoint}transaction/`);

        for (let [key, value] of Object.entries(parameters)) {
            url.searchParams.set(key, value);
        }

        return this.sendTransactionRequest(url.toString());
    }

    /**
     * @override
     * Gets a paged list of transactions for the method
     * @param {string} method - The method
     * @param {Object} parameters - The query parameters
     * @returns {Promise<PagedResponse>} - A response wrapped in a {@link PagedResponse} helper
     */
    async getMethodTransactions(method, parameters) {
        this.validateGetCall(method, parameters);

        let url = new URL(`${this.endpoint}${method}/`);

        for (let [key, value] of Object.entries(parameters)) {
            url.searchParams.set(key, value);
        }

        return this.sendTransactionRequest(url.toString());
    }

    /**
     * @protected
     * @override
     * Internal function for sending transaction GET requests
     * @param {URL} url - The URL
     * @returns {Promise<PagedResponse>} - A response wrapped in a {@link PagedResponse} helper
     */
    async sendTransactionRequest(url){
        let response = await axios.request({
            url: url,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            responseType: 'json'
        })
            .catch(ex=>{
                throw new GetTransactionsException(ex.response.data);
            });

        return new PagedResponse(response.data, url, this);
    }


    /**
     * @override
     * Gets a the bundle metadata for a transaction
     * @param {string} transactionIdOrHash - Either a transaction ID or a transaction hash
     * @returns {Promise<Object>} - The bundle metadata
     */
    async getBundleMetadataForTransaction(transactionIdOrHash) {
        let url = new URL(`${this.endpoint}transaction/${transactionIdOrHash}/bundle/`);

        url.searchParams.append('no_files', true);

        let response = await axios.request({
            url: url,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            json: true
        })
            .catch(ex=>{
                throw new GetRequestException(ex.response.data);
            });

        return response.data;
    }

    /**
     * @override
     * Gets the bundle for a transaction
     * @param {string} transactionIdOrHash - Either a transaction ID or a transaction hash
     * @returns {Promise<ReadableStream|Blob>} - The bundle
     */
    async getBundleForTransaction(transactionIdOrHash) {
        let url = new URL(`${this.endpoint}transaction/${transactionIdOrHash}/bundle_raw/`);

        let responseType = 'arraybuffer';
        if (typeof window !== 'undefined'){
            //in a browser
            responseType = 'blob';
        }

        let response = await axios.request({
            url: url,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            responseType: responseType
        })
            .catch(ex=>{
                throw new GetRequestException(ex.response.data);
            });

        return response.data;
    }

    /**
     * @override
     * Gets a file from the bundle for a transaction
     * @param {string} transactionIdOrHash - Either a transaction ID or a transaction hash
     * @param {number} fileIdx - The index of the file in the bundle metadata
     * @param {boolean} stream - If true, returns a {@link ReadableStream}, otherwise returns a {@link Blob}
     * @returns {Promise<ReadableStream|Blob>} - The file
     */
    async getFileFromBundleForTransaction(transactionIdOrHash, fileIdx, stream) {
        let url = new URL(`${this.endpoint}transaction/${transactionIdOrHash}/file/${fileIdx}/`);

        let responseType = 'arraybuffer';
        if (typeof window !== 'undefined'){
            //in a browser
            responseType = 'blob';
        }
        if(stream){
            responseType = 'stream';
        }

        let response = await axios.request({
            url: url,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            responseType: responseType
        })
            .catch(ex=>{
                throw new GetRequestException(ex.response.data);
            });

        console.log(response);
        return response.data;
    }

    /**
     * @override
     * Gets a file from the bundle for a transaction
     * @param {string} transactionIdOrHash - Either a transaction ID or a transaction hash
     * @param {string} fileName - The name of the file in the bundle metadata
     * @param {boolean} stream - If true, returns a {@link ReadableStream}, otherwise returns a {@link Blob}
     * @returns {Promise<ReadableStream|Blob>} - The file
     */
    async getFileFromBundleByNameForTransaction(transactionIdOrHash, fileName, stream) {
        let url = new URL(`${this.endpoint}transaction/${transactionIdOrHash}/fileByName/${fileName}/`);

        let responseType = 'arraybuffer';
        if (typeof window !== 'undefined'){
            //in a browser
            responseType = 'blob';
        }
        if(stream){
            responseType = 'stream';
        }

        let response = await axios.request({
            url: url,
            method: 'GET',
            headers: this.apiAuthHeaders(),
            responseType: responseType
        })
            .catch(ex=>{
                throw new GetRequestException(ex.response.data);
            });

        console.log(response);
        return response.data;
    }
}

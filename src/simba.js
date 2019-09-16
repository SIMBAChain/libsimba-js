import { pollWrapper } from 'poll-js';
import { GenerateTransactionException, SubmitTransactionException, TransactionStatusCheckException } from './exceptions';

export default class Simba {
    constructor(endpoint, apiKey, managementKey, wallet) {
        if (!endpoint.endsWith('/')) {
            this.endpoint = `${endpoint}/`;
        } else {
            this.endpoint = endpoint;
        }

        this.apiKey = apiKey;
        this.managementKey = managementKey;
        this.wallet = wallet;
    }

    async callMethod(method, parameters) {
        const data = Object.assign({from: await this.wallet.getAddress()}, parameters);
        let txnId = null;

        return fetch(`${this.endpoint}${method}/`, {
            method: 'POST',
            cache: 'no-cache',
            headers: this.apiAuthHeaders(),
            body: JSON.stringify(data),
        })
            .then(async (response) => {
                let data = await response.json();

                if (response.status >= 400) {
                    throw new GenerateTransactionException(JSON.stringify(data));
                }
                // tslint:disable-next-line: no-unsafe-any
                txnId = data.id;
                // tslint:disable-next-line: no-unsafe-any
                const payload = data.payload.raw;
                // tslint:disable-next-line: no-unsafe-any
                const signed = await this.wallet.sign(payload);

                return fetch(`${this.endpoint}transaction/${txnId}/`, {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: this.apiAuthHeaders(),
                    body: JSON.stringify({payload: signed}),
                })
            })
            .then(async (response) => {
                let data = await response.json();

                if (response.status >= 400) {
                    throw new SubmitTransactionException(JSON.stringify(data));
                }
                // tslint:disable-next-line: no-console
                console.log('Success!', data);

                return txnId;
            })
    }

   getTransactionStatus(txnId){
        return fetch(`${this.endpoint}transaction/${txnId}/`, {
            method: 'GET',
            cache: 'no-cache',
            headers: this.apiAuthHeaders(),
        })
            .then(async (response) => {
                let data = await response.json();

                if (response.status >= 400) {
                    throw new TransactionStatusCheckException(JSON.stringify(data));
                }

                return data;
            });
    }

    checkTransactionStatusFromObject(txn){
        let ret = {
            status:'',
            transaction_hash: ''
        };

        if(txn.transaction_hash){
            ret.transaction_hash = txn.transaction_hash;
        }

        if (txn.error){
            ret.status = 'error';
            ret.error = txn.error;
            ret.error_details = txn.error_details;
        }else if(!txn.receipt){
            ret.status = 'pending';
        }else{
            ret.status = 'success';
        }

        return ret;
    }

   checkTransactionStatus(txnId){
        return this.getTransactionStatus(txnId)
            .then(this.checkTransactionStatusFromObject);
    }

    /**
     * Returns an object with 'future' and 'cancel' keys.
     * future is the promise to listen on for the response or an error.
     * cancel is a function - call it to cancel the polling.
     * @param txnId - the transaction ID
     * @param pollInterval - the interval in ms for polling
     */
    waitForSuccessOrError(txnId, pollInterval){
        if(!pollInterval) pollInterval = 5000;

        return pollWrapper({
            request: () => this.getTransactionStatus(txnId),
            pollingPeriod: pollInterval, // ms
            shouldStop: (txn)=> this.checkTransactionStatusFromObject(txn).status !== 'pending'
        });
    }

    async callMethodWithFile(method, parameters) {
        throw new Error('Not yet implemented')
    }

    apiAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            APIKEY: this.apiKey,
        }
    }

    managementAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            APIKEY: this.managementKey,
        }
    }
}

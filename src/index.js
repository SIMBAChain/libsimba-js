import {SimbaBase, Simbachain} from './simba';
import {Wallet, LocalWallet} from './wallet';
import {NotImplementedException} from './exceptions';

/**
 * Create an instance of a Simbachain API interaction class
 * Automatically takes care of choosing the correct implementation and running asynchronous initialisation.
 * @param {string} url - The API URL
 * @param {Wallet} wallet - The Wallet to use
 * @param {string} [apiKey] - (Optional) The API key
 * @param {string} [managementKey] - (Optional) The Management API key
 * @returns {Promise<Simbachain>} - An initialised instance of the API interaction class
 */
const getSimbaInstance = async (url, wallet, apiKey, managementKey) => {
        if(url.startsWith('https://api.simbachain.com')){
            //.com
            let simba = new Simbachain(url, wallet);

            if(apiKey){
                simba.setApiKey(apiKey)
            }

            if(managementKey){
                simba.setManagementKey(managementKey)
            }

            await simba.initialize();

            return simba;
        }else{
            //scaas
            throw new NotImplementedException("SCaaS Support not yet implemented, sorry.")
        }
};

export {
    SimbaBase,
    Simbachain,
    Wallet,
    LocalWallet,
    getSimbaInstance
}

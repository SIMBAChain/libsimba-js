/**
 * Wrapper for paged responses
 */
export default class PagedResponse {
    /**
     * Wrapper for paged responses
     * @param {Object} data - The response
     * @param {URL} url - The URL that provided the response
     * @param {SimbaBase} simba - The SimbaBase instance that requested the response
     */
    constructor(data, url, simba){
        this.url = new URL(url);
        this._count = data.count;
        this._next_page = data.next;
        this._previous_page = data.previous;
        this.results = data.results;
        this.simba = simba;
    }

    /**
     * Grab the next page
     * @returns {Promise<PagedResponse> | null} - Null if there's no next page
     */
    async next(){
        if(!this._next_page) return null;
        let url = new URL(this.url.toString());
        url.searchParams.set('page', this._next_page);
        return this.simba.sendTransactionRequest(url);
    }

    /**
     * Grab the previous page
     * @returns {Promise<PagedResponse> | null} - Null if there's no next page
     */
    async previous(){
        if(!this._previous_page) return null;
        let url = new URL(this.url.toString());
        url.searchParams.set('page', this._previous_page);
        return this.simba.sendTransactionRequest(url);
    }

    /**
     * Returns the actual data
     * @returns {Object}
     */
    data(){
        return this.results;
    }

    /**
     * Returns the result count
     * @returns {number}
     */
    count(){
        return this._count;
    }

    /**
     * Returns the current page number
     * @returns {number}
     */
    current_page(){
        return this.url.searchParams.get('page');
    }

    /**
     * Returns the next page number
     * @returns {number}
     */
    next_page(){
        return this._next_page;
    }

    /**
     * Returns the previous page number
     * @returns {number}
     */
    previous_page(){
        return this._previous_page;
    }
}

import { IUserEntireData } from "./interfaces/UserInterface";

type TFetcherType = "fetcher" | "XHR";
interface INetworkError {
    status : number;
    url : string;

}

class RaftaRequest {
    private http : (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response> ;

    constructor() {
        this.http = window.fetch;
    }

    initialPackageRequest(packageName : string) : Promise<Request> {
        // get all setting and configuration of this customer package
        // this.http()
        return new Promise((res) => {
            res(true)
        })
    }

    identifyUserRequest(userEntireData : IUserEntireData) {
        // identify current user width user basic information
    }



    private networkRequestRejectEvent(fetcherType : TFetcherType , error : INetworkError ) {

    }

    overrideBrowserPromise() {
        // class Promise extends window.Promise {
        //     constructor(executor) {
        //         super(executor);
        //     }
        // }
    }

    overrideBrowserFetcher() {
        const {fetch: origFetch} = window;
        window.fetch = (...args) => new Promise((resolve , reject) => {
            (async() => {
                return await origFetch(...args) 
                    .then(res => {
                        if(!res.ok && (res.status < 200 || res.status >= 300)) {
                            throw new Error();
                        }else resolve(res);
                    })
                    .catch(err => {
                        // this.networkRequestRejectEvent("fetcher" , err)
                        reject(err);
                    })
            })();
        })
    }
}


export default RaftaRequest;
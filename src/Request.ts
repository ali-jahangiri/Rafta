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

    overrideBrowserFetcher() {
        const {fetch: origFetch} = window;
        window.fetch = (...args) => new Promise((resolve , reject) => {
            (async() => {
                return await origFetch(...args) 
                    .then(res => {
                        if(!res.ok && (res.status < 200 || res.status >= 300)) {
                            throw new Error()
                        }else resolve(res);
                    })
                    .catch(err => {
                        // this.networkRequestRejectEvent("fetcher" , err)
                        reject(err);
                    })
            })();
        })

        fetch('https://jsonplaceholder.typicode.com/todos/990')
            .then(data => data.json())
            .then(data => console.log(data))
            .catch(err => {
                console.log(err);
                
            })
    }
}


export default RaftaRequest;




// const {fetch: origFetch} = window;
//         window.fetch = () => async (...args) => {
//         console.log("fetch called with args:", args);
//         const response = await origFetch(...args);
        
//         /* work with the cloned response in a separate promise
//             chain -- could use the same chain with `await`. */
//         return response
//             .clone()
//             .json()
//             .then(body => console.log("intercepted response:", body))
//             .catch(err => console.error(err))
//         ;
            
//         /* the original response can be resolved unmodified: */
//         //return response;
        
//         /* or mock the response: */
//         // return {
//         //     ok: true,
//         //     status: 200,
//         //     json: async () => ({
//         //     userId: 1,
//         //     id: 1,
//         //     title: "Mocked!!",
//         //     completed: false
//         //     })
//         // };
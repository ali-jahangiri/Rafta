import { baseUrl } from "./serverPath";

function fetcher(path : string , config : object) {
    const enhancedFetchConfig = (() => {
        if(config) {
            return {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({ config }),
            }
        }else return undefined;
    })();

    return new Promise((res , _) => {
        window.fetch(`${baseUrl}${path}` , enhancedFetchConfig)
        .then(res => res.json())
        .then(data => res(data));
    })
}

export default fetcher;
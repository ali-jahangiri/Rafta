interface IRaftaPerformance {

}



class RaftaPerformance {
    timeline : [];
    browserObserver : PerformanceObserver;
    observeCallbackHolder : () => Function;

    constructor() {
        this.timeline = [];

        function observeCallbackHolder(entryList) {
            return (callback : () => void) => {
                // for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
                //     console.log('FCP candidate:', entry.startTime, entry);
                //   }
                callback(entryList);
            }
        }

        this.browserObserver = new PerformanceObserver(observeCallbackHolder);

        this.observeCallbackHolder = observeCallbackHolder(() => {});
    }

    private browserTabVisibilityChecker(callback : (defaultVisibilityStatus : boolean) => void) {
        const currentVisibilityStatus = document?.visibilityState;
        let wasExecuteCallbackOnce = false;

        const onBrowserVisibilityChangeHandler = () => {
            
            if(document.visibilityState === 'visible' && !wasExecuteCallbackOnce) {
                wasExecuteCallbackOnce = true;
                callback(false);
                window.removeEventListener("visibilitychange" , onBrowserVisibilityChangeHandler);
            };
        }

        if(currentVisibilityStatus === "visible") {
            wasExecuteCallbackOnce = true;
            callback(true);
        }else window.addEventListener("visibilitychange" , onBrowserVisibilityChangeHandler , true);
    }
    
    private initialPaintObservation() {

        

        // this.browserObserver.takeRecords()
        
        
        // const resources = window.performance.getEntriesByType("paint");
        // resources.forEach(resource => {
        //     if(resource.name === "first-contentful-paint")
        //     console.log(resource.name , resource.startTime);
        // });
    }

    afterDOMLoadObservation() {

        console.log(this.observeCallbackHolder());
        
        // this.browserTabVisibilityChecker(defaultVisibilityStatus => {
        //     this.browserObserver.observe({type: 'paint', buffered: true});
        // })
    }


    afterLoadObservation() {

    }

    setRuntimeObservation() {
        
    }


    setMarker() {

    }
}

export default RaftaPerformance;
import BrowserPerformanceObserver, { IBrowserPerformanceObserver } from "./BrowserPerformanceObserver";

interface IRaftaPerformance {

}



class RaftaPerformance {
    timeline : [];
    private browserPerformanceObserver : IBrowserPerformanceObserver;
    
    
    constructor() {
        this.timeline = [];
        this.browserPerformanceObserver = new BrowserPerformanceObserver(this.onObservation);
    }

    onObservation(entryList : PerformanceObserverEntryList) {
        
        for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
            console.log('FCP candidate:', entry.startTime, entry);
        }
        for (const entry of entryList.getEntriesByName("mark")) {
            console.log(entry.startTime, entry);
        }


        
    }

    private windowTabVisibilityChecker(callback : (defaultVisibilityStatus : boolean) => void) {
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
    
    private initialRecord() {
        this.windowTabVisibilityChecker(defaultVisibilityStatus => {
            // this.browserPerformanceObserver.observer.observe({type: 'paint', buffered: true});
        })

        // const resources = window.performance.getEntriesByType("paint");
        // resources.forEach(resource => {
        //     if(resource.name === "first-contentful-paint")
        //     console.log(resource.name , resource.startTime);
        // });
    }

    afterDOMLoadObservation() {
        this.initialRecord();
    }


    afterLoadObservation() {
        console.log("afterLoadObservation" , performance.now());
        
        
                
        console.log('====================================?' , performance.now());
        var loadTime = window.performance.timing.domContentLoadedEventEnd-window.performance.timing.unloadEventStart; 
        let other = performance.timing.domComplete
        console.log('Page load time is '+ loadTime , other)
    }

    setRuntimeObservation() {
        
    }


    private setMarker() {

    }
}

export default RaftaPerformance;
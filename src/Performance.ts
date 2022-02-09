import appContext from "./AppContext";
import BrowserPerformanceObserver, { IBrowserPerformanceObserver } from "./BrowserPerformanceObserver";

interface IRaftaPerformanceMark {
    name : string;
    time : number;
}
export type TRaftaPerformanceTimeline = IRaftaPerformanceMark[];

type TPaintEntryType = "first-paint" | "first-contentful-paint";

const paintShortNameClone = {
    "first-paint" : "FP",
    "first-contentful-paint" : "FCP",
}

class RaftaPerformance {
    private browserPerformanceObserver : IBrowserPerformanceObserver;
    timeline : TRaftaPerformanceTimeline;
    
    constructor() {
        const { performanceTimeline } = appContext.getContext()
        this.browserPerformanceObserver = new BrowserPerformanceObserver(this.onObservation.bind(this));
        this.timeline = performanceTimeline;
    }


    private paintEntryMarkerHandler(paintType : TPaintEntryType , time : number) {
        console.log('sd');
        
        this.markToTimeline({
            name : paintShortNameClone[paintType],
            time,
        })   
    }

    onObservation(entryList : PerformanceObserverEntryList) {
        entryList.getEntries().forEach(entry => {
            // console.log(entry.name);
            console.log(entry);
            
            if(entry.entryType === "paint") this.paintEntryMarkerHandler((entry.name as TPaintEntryType) , entry.startTime);
        })
        for (const entry of entryList.getEntriesByName('')) {
            console.log('FCP candidate:', entry.startTime, entry);

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
        // this.initialRecord();

        this.markToTimeline({
            name : "DOMLoad",
            time : performance.now(),
        })
    }


    afterLoadObservation() {
        this.markToTimeline({
            name : "fullLoad",
            time : performance.now(),
        })
    }

    setRuntimeObservation() {
        
    }


    private markToTimeline(mark : IRaftaPerformanceMark) {
        this.timeline.push(mark);
        // console.log(this.timeline);
    }
}

export default RaftaPerformance;
import appContext from "./AppContext";
import BrowserPerformanceObserver, { IBrowserPerformanceObserver } from "./BrowserPerformanceObserver";
import { findDOMPath } from "./helper/index";

interface IRaftaPerformanceMark<T> {
    name : string;
    time : number;
    additionalData ?: T
}
export type TRaftaPerformanceTimeline<T> = IRaftaPerformanceMark<T>[];

enum PerformanceEntryName {
    FIRST_PAINT = "first-paint" , 
    FIRST_CONTENT_FULL_PAINT = "first-contentful-paint" , 
    FIRST_INPUT = "first-input"
};
type TPaintEntryType = PerformanceEntryName.FIRST_PAINT | PerformanceEntryName.FIRST_INPUT | PerformanceEntryName.FIRST_CONTENT_FULL_PAINT;

const performanceEntryShortName = {
    [PerformanceEntryName.FIRST_CONTENT_FULL_PAINT] : "FCP",
    [PerformanceEntryName.FIRST_INPUT] : "FID",
    [PerformanceEntryName.FIRST_PAINT] : "FP",
}


interface IFirstInteractionParament {
    time : number;
    target :  Node | null;
    event : string;
}

class RaftaPerformance<T> {
    timeline : TRaftaPerformanceTimeline<T>;
    
    constructor() {
        const { performanceTimeline } = appContext.getContext()
        const browserPerformanceObserver = new BrowserPerformanceObserver(this.onObservation.bind(this));
        this.timeline = performanceTimeline;
    }


    private paintEntryMarkerHandler(paintType : TPaintEntryType , time : number) {
        this.markToTimeline({
            name : performanceEntryShortName[paintType],
            time,
        });
    }

    private firstInteractionDelayHandler(params : IFirstInteractionParament) {

        const { time , target , event } = params;

        this.markToTimeline({
            name : performanceEntryShortName[PerformanceEntryName.FIRST_INPUT],
            time,
            additionalData : {
                targetPath : target ? findDOMPath(target) : null,
                event,
            }
        })
    }

    onObservation(entryList : PerformanceObserverEntryList) {
        entryList.getEntries().forEach(entry => {
            
            console.log(entry);
            const { name , startTime } = entry;
            const entryName = <TPaintEntryType>name;

            if(entry.entryType === "paint") this.paintEntryMarkerHandler(entryName , startTime);
            if(entry.entryType === PerformanceEntryName.FIRST_INPUT) {
                const { target , name , startTime } = (entry as PerformanceEventTiming);
                this.firstInteractionDelayHandler({ event : name , target , time : startTime });
            }


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


    private markToTimeline(mark : IRaftaPerformanceMark<T>) {
        this.timeline.push(mark);
        console.log(this.timeline);
    }
}

export default RaftaPerformance;
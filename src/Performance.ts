import appContext from "./AppContext";
import BrowserPerformanceObserver from "./BrowserPerformanceObserver";
import { findDOMPath } from "./helper/index";

interface IRaftaPerformanceMetricMark<T> {
    name : string;
    time : number;
    additionalData ?: T
}

interface IRaftaPerformanceResourceMark {
    path : string;
    size : number;
    duration : number;
    startAt : number;
}

interface IFirstInteractionParament {
    time : number;
    target :  Node | null;
    event : string;
}

export interface IRaftaPerformanceTimeline<T> {
    initialResource : IRaftaPerformanceResourceMark[],
    initialLoadMetrics : IRaftaPerformanceMetricMark<T>[]
}

enum PerformanceEntryName {
    FIRST_PAINT = "first-paint" , 
    FIRST_CONTENT_FULL_PAINT = "first-contentful-paint" , 
    FIRST_INPUT = "first-input"
};


type TPaintEntryType = PerformanceEntryName.FIRST_PAINT | PerformanceEntryName.FIRST_INPUT | PerformanceEntryName.FIRST_CONTENT_FULL_PAINT;
type TPathTOMark = "metric" | "resource";

const performanceEntryShortName = {
    [PerformanceEntryName.FIRST_CONTENT_FULL_PAINT] : "FCP",
    [PerformanceEntryName.FIRST_INPUT] : "FID",
    [PerformanceEntryName.FIRST_PAINT] : "FP",
}

class RaftaPerformance<T> {
    timeline : IRaftaPerformanceTimeline<T>;
    private isAfterFullLoad : boolean;
    
    constructor() {
        const { performanceTimeline } = appContext.getContext()
        const browserPerformanceObserver = new BrowserPerformanceObserver(this.onObservation.bind(this));
        this.timeline = performanceTimeline;
        this.isAfterFullLoad = false;
    }


    private paintEntryMarkerHandler(paintType : TPaintEntryType , time : number) {
        this.markToTimeline({
            name : performanceEntryShortName[paintType],
            time,
        } , "metric");
    }

    private firstInteractionDelayHandler(params : IFirstInteractionParament) {

        const { time , target , event } = params;

        const additionalData = {
            targetPath : target ? findDOMPath(target) : null,
            event,
        }

        this.markToTimeline({
            name : performanceEntryShortName[PerformanceEntryName.FIRST_INPUT],
            time,
            additionalData,
        } , 'metric');
    }


    private resourceMarkerHandler(params : IRaftaPerformanceResourceMark) {
        this.markToTimeline({
            ...params
        } , "resource")
    }

    onObservation(entryList : PerformanceObserverEntryList) {
        entryList.getEntries().forEach(entry => {
            
            const { name , startTime } = entry;
            const entryName = <TPaintEntryType>name;

            if(entry.entryType === "paint") this.paintEntryMarkerHandler(entryName , startTime);
            else if(entry.entryType === PerformanceEntryName.FIRST_INPUT) {
                const { target , name , startTime } = (entry as PerformanceEventTiming);
                this.firstInteractionDelayHandler({ event : name , target , time : startTime });
            }else if(entry.entryType === "resource") {
                const { transferSize , name , duration , requestStart , startTime , initiatorType } = (entry as PerformanceResourceTiming);

                this.resourceMarkerHandler({
                    duration,
                    path : name ,
                    size : transferSize ,
                    startAt : requestStart || startTime,
                })
            }


        });
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

    afterDOMLoadObservation() {
        this.markToTimeline({
            name : "DOMLoad",
            time : performance.now(),
        } , "metric");
    }


    afterLoadObservation() {
        this.isAfterFullLoad = true;
        this.markToTimeline({
            name : "fullLoad",
            time : performance.now(),
        } , "metric");
    }

    setRuntimeObservation() {
        
    }

    private markToTimeline(mark : IRaftaPerformanceMetricMark<T> , pathToMarkAs : 'metric') : void;
    private markToTimeline(mark : IRaftaPerformanceResourceMark , pathToMarkAs : 'resource') : void;
    private markToTimeline(mark : IRaftaPerformanceMetricMark<T> | IRaftaPerformanceResourceMark , pathToMarkAs : TPathTOMark) {
        if(pathToMarkAs === "metric") this.timeline.initialLoadMetrics.push((mark as IRaftaPerformanceMetricMark<T>));
        else if(pathToMarkAs === "resource") this.timeline.initialResource.push(mark as IRaftaPerformanceResourceMark);
        console.log(this.timeline);
    }
}

export default RaftaPerformance;
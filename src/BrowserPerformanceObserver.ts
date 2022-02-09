export interface IBrowserPerformanceObserver {
    observer : PerformanceObserver;
}

class BrowserPerformanceObserver {
    observer : PerformanceObserver;

    constructor(onObservation: (entryList : PerformanceObserverEntryList) => void) {
        this.observer = new PerformanceObserver(onObservation);
        const OBSERVER_ENTRY_TYPE = [
            // 'resource',
            // 'measure',
            'paint' ,
            // "event",
            "first-input",
        ];
        
        this.observer.observe({ entryTypes: OBSERVER_ENTRY_TYPE })
    }
}


export default BrowserPerformanceObserver;
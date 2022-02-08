export interface IBrowserPerformanceObserver {
    observer : PerformanceObserver;
}

class BrowserPerformanceObserver {
    observer : PerformanceObserver;

    constructor(onObservation: (entryList : PerformanceObserverEntryList) => void) {
        this.observer = new PerformanceObserver(onObservation);
        this.observer.observe({entryTypes: ['resource', 'mark', 'measure' , 'paint']})
    }
}


export default BrowserPerformanceObserver;
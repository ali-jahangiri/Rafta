interface IRaftaLifecycle {
    
}

class RaftaLifecycle {
    private readonly syncTimeout : number;
    private syncTimerId : number | undefined;

    constructor() {
        this.syncTimeout = 3000;
    }

    beforeDOMLoad(callBack : () => void) {
        callBack();
        // const observer = new PerformanceObserver((list) => {
        //     for (const entry of list.getEntries()) {
        //       // `name` will be either 'first-paint' or 'first-contentful-paint'.
        //       const metricName = entry.name;
        //       const time = Math.round(entry.startTime + entry.duration);
          
        //       console.log('send', 'event', {
        //         eventCategory: 'Performance Metrics',
        //         eventAction: metricName,
        //         eventValue: time,
        //         nonInteraction: true,
        //         additional : entry
        //       });
        //     }
        //   });
          
        //   // Start observing paint entries.
        //   observer.observe({entryTypes: ['paint']});
    }

    afterDOMLoad(callback : () => void) {
        window.addEventListener("DOMContentLoaded" , callback);
    }

    afterFullDocumentLoad(callback : () => void) {
        window.addEventListener('load' , callback);
    }

    timePeriod(callBack : () => void) {
        let timer = window.setInterval(() => {
            callBack();
        } , this.syncTimeout);
        this.syncTimerId = timer;
    }

    onInitialSetupSuccessfullyComplete() {

    }

    unSubscribe() {
        window.clearInterval(this.syncTimerId);
    }
}



export default RaftaLifecycle;
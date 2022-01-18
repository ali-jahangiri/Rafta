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
    }

    afterDOMLoad(callback : () => void) {
        window.addEventListener("DOMContentLoaded" , callback)
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
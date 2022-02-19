class RaftaLifecycle {
    private readonly syncTimeout : number;
    private syncTimerId : number | undefined;

    constructor() {
        this.syncTimeout = 1000;
    }

    beforeDOMLoad(callBack : () => void) {
        callBack();
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

    unSubscribe() {
        window.clearInterval(this.syncTimerId);
    }
}



export default RaftaLifecycle;
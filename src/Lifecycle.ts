class RaftaLifecycle {
    private readonly serverSyncTimeout : number;
    private syncTimerId : number | undefined;

    constructor() {
        this.serverSyncTimeout = 1000;
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

    callServerTimePeriod(callBack : () => void) {
        let timer = window.setInterval(() => {
            callBack();
        } , this.serverSyncTimeout);
        this.syncTimerId = timer;
    }

    unSubscribe() {
        window.clearInterval(this.syncTimerId);
    }
}



export default RaftaLifecycle;
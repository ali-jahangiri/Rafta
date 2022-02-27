export interface IRaftaUserVisibilityChangeHandler {
    attachEventToWindow : () => void;
    terminateEvent : () => void;
}

class RaftaUserVisibilityChangeEventHandler {
    private parentEventDispatcher : () => void;
    private callbackReference : () => void;
    
    constructor(parentEventDispatcher : () => void) {
        this.parentEventDispatcher = parentEventDispatcher;
        this.callbackReference = () => {};
    }

    attachEventToWindow() {
        // when user is not focus on page and cannot see current document
        this.callbackReference = () => this.parentEventDispatcher();
        window.document.addEventListener("visibilitychange" , this.callbackReference);
    }

    terminateEvent() {
        window.document.removeEventListener("visibilitychange" , this.callbackReference);
    }
}


export default RaftaUserVisibilityChangeEventHandler;
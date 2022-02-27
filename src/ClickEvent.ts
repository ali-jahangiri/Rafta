type TParentEventDispatcher = (e : MouseEvent) => void;

export interface IRaftaClickHandler {
    attachEventToWindow : () => void;
    terminateEvent : () => void;
}


class RaftaClickEventHandler {
    private callbackReference : TParentEventDispatcher;
    private parentEventDispatcher : TParentEventDispatcher

    constructor(parentEventDispatcher : TParentEventDispatcher) {
        this.parentEventDispatcher = parentEventDispatcher;
        this.callbackReference = () => {};
    }

    attachEventToWindow() {
        this.callbackReference = (e : MouseEvent) => this.parentEventDispatcher(e);
        window.document.addEventListener("click" , this.callbackReference);
    }

    terminateEvent() {
        window.document.removeEventListener("click" , this.callbackReference);
    }
}


export default RaftaClickEventHandler;
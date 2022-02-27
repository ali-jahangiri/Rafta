import { debounce, selfClearTimeout } from "../helper";

class RaftaScrollEventHandler {
    private parentEventDispatcher : () => void;
    private callbackReference : () => void;
    private readonly scrollEventDebounce : number;
    private readonly initialScrollEventListenerDelayForAttachment : number;

    constructor(parentEventDispatcher : () => void) {
        this.parentEventDispatcher = parentEventDispatcher;

        this.callbackReference = () => {};

        // (for detection hard scroll with factor of time & scroll px in near that rise for 2 time in near distance ) scrollEventDebounce = 18;
        this.scrollEventDebounce = 20;
        this.initialScrollEventListenerDelayForAttachment = 100;

    }


    attachEventToWindow() {
        this.callbackReference = debounce(this.parentEventDispatcher.bind(this) , this.scrollEventDebounce);
        selfClearTimeout(() => {
            window.document.addEventListener("scroll" , this.callbackReference);
        } , this.initialScrollEventListenerDelayForAttachment);
    }

    terminateEvent() {
        window.document.removeEventListener('scroll' , this.callbackReference);
    }
}


export default RaftaScrollEventHandler;
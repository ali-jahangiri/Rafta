import { makeLeanKeyboardEvent } from "../helper/index";

export interface IRaftaKeyboardEvent {
    shift ?: boolean;
    ctrl ?: boolean;
    alt ?: boolean;
    wasLong ?: number;
    target ?: string;
    char : string;
}

interface ICallbacksReference {
    keypress : (e : KeyboardEvent) => void;
    keyUp : (e : KeyboardEvent) => void;
    keyDown : (e : KeyboardEvent) => void;
}

type TParentEventDispatcher = (e : IRaftaKeyboardEvent) => void;

enum KeyboardEventKeyString {
    KEYPRESS = "keypress" ,
    KEYUP = "keyup",
    KEYDOWN = "keydown",
};


class RaftaKeyboardEventHandler {
    private keyPressTime: number;
    private ignoreSpecificsKey : boolean;
    private allowedTimeToDispatchLongKeyPress : number;
    private parentEventDispatcher : TParentEventDispatcher;
    private lastPressedKey : KeyboardEvent[];
    private tempTimerId : NodeJS.Timer | undefined;

    private callbacksReference : ICallbacksReference;


    constructor(ignoreOnlySpecificsKer : boolean , parentEventDispatcher : TParentEventDispatcher ) {
        this.allowedTimeToDispatchLongKeyPress = 3;
        this.keyPressTime = 0;

        this.ignoreSpecificsKey = ignoreOnlySpecificsKer;
        this.parentEventDispatcher = parentEventDispatcher;

        this.lastPressedKey = [];

        this.callbacksReference = {
            keypress : () => {} ,
            keyUp : () => {} ,
            keyDown : () => {} ,
        }
    }
    

    private longKeyPressTimer() {
        this.tempTimerId = setInterval(() => {
            // if user hold a key for a long , but exist form current document event holding that target key press , we should stop counting long key press timing
            const isUserIsCurrentlyInDocument = document.visibilityState === "visible" && document.hasFocus();
            if(isUserIsCurrentlyInDocument) this.keyPressTime++;
            else this.detectLongKeyPressHandler();
        } , 100);
    }

    private checkTimerListenerAttachment() {
        const wasFromSameKeysType = this.lastPressedKey.every(el => el.key === this.lastPressedKey[0].key);

        if(!wasFromSameKeysType) {
            this.lastPressedKey = [];
        }else if(this.tempTimerId === undefined) this.longKeyPressTimer();
    }

    private dispatchLongKeyPressHandler(keyLongPressMsTime : number , keyLongPressEventObject : KeyboardEvent) {
        this.parentEventDispatcher(makeLeanKeyboardEvent(keyLongPressEventObject , keyLongPressMsTime));
    }

    private dispatchKeyPressHandler(e : KeyboardEvent) {
        this.parentEventDispatcher(makeLeanKeyboardEvent(e , false));
    }

    private detectLongKeyPressHandler() {
        // stop long press timer if we set it before
        if(this.tempTimerId !== undefined) {
            clearInterval(this.tempTimerId);
            this.tempTimerId = undefined;
            const keyLongPressMsTime = this.keyPressTime;
            const keyLongPressEventObject = this.lastPressedKey[0];
            this.dispatchLongKeyPressHandler(keyLongPressMsTime , keyLongPressEventObject);
            this.keyPressTime = 0;
        }
        this.lastPressedKey = [];
    }

    private keyDownHandler(e : KeyboardEvent) {
        if(this.lastPressedKey?.length >= this.allowedTimeToDispatchLongKeyPress) this.checkTimerListenerAttachment();
        else this.lastPressedKey?.push(e);
    }

    private specificKeyUpHandler() {
        if(this.keyPressTime) this.detectLongKeyPressHandler();
        else {
            this.lastPressedKey = [];
        }
    }

    private keyUpHandler(e : KeyboardEvent) {
        // old strick logic => this.lastPressedKey.length >= this.allowedTimeToDispatchLongKeyPress && this.lastPressedKey.some(el => el.key === e.key) &&
        if(this.keyPressTime) this.detectLongKeyPressHandler();
        else {
            this.lastPressedKey = [];
            this.dispatchKeyPressHandler(e);
        }
    }

    attachEventToWindow() {
        if(this.ignoreSpecificsKey) {
            this.callbacksReference.keypress = this.keyDownHandler.bind(this);
            window.document.addEventListener(KeyboardEventKeyString.KEYPRESS , this.callbacksReference.keypress);
        }else {
            this.callbacksReference.keyDown = this.keyDownHandler.bind(this);
            window.document.addEventListener(KeyboardEventKeyString.KEYDOWN , this.callbacksReference.keyDown);
        }

        this.callbacksReference.keyUp = this.ignoreSpecificsKey 
                                        ? this.specificKeyUpHandler.bind(this) 
                                        : this.keyUpHandler.bind(this);

        window.document.addEventListener(KeyboardEventKeyString.KEYUP , this.callbacksReference.keyUp);
    }

    terminateEvent() {
        if(this.ignoreSpecificsKey) window.document.removeEventListener(KeyboardEventKeyString.KEYPRESS , this.callbacksReference.keypress);
        else window.document.removeEventListener(KeyboardEventKeyString.KEYDOWN , this.callbacksReference.keyDown);
        window.document.removeEventListener(KeyboardEventKeyString.KEYUP , this.callbacksReference.keyUp);
    }
}


export default RaftaKeyboardEventHandler;
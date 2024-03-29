import RaftaEventStore from "./EventStore";
import { findClickPos, findDOMPath } from "./helper";
import { IRaftaEventModule } from "./interfaces/eventInterface";
import { EventsKeyName } from "./interfaces/eventStoreInterface";
import { 
    RaftaClickEventHandler,
    RaftaKeyboardEventHandler,
    RaftaMouseMoveEventHandler,
    RaftaResizeEventHandler,
    RaftaScrollEventHandler,
    RaftaUserVisibilityChangeEventHandler
} from "./Event/index";
import { IRaftaKeyboardEvent } from "./Event/KeyboardEvent";

class RaftaEvent {
    private focusObserverId : NodeJS.Timer | undefined;
    
    private readonly shouldPreventServerConnectOnUserSleep : boolean;

    private keyboardEvent : IRaftaEventModule;
    private mouseMoveEvent : IRaftaEventModule;
    private resizeEvent : IRaftaEventModule;
    private clickEvent : IRaftaEventModule;
    private scrollEvent : IRaftaEventModule;
    private visibilityChange : IRaftaEventModule;

    private eventStore : RaftaEventStore;

    constructor(eventStore : RaftaEventStore) {
        
        this.shouldPreventServerConnectOnUserSleep = true;

        this.eventStore = eventStore;
        
        this.keyboardEvent = new RaftaKeyboardEventHandler(false , this.typeHandler.bind(this));
        this.mouseMoveEvent = new RaftaMouseMoveEventHandler(this.mouseMoveHandler.bind(this));
        this.resizeEvent = new RaftaResizeEventHandler(this.resizeHandler.bind(this) , this.zoomHandler.bind(this));
        this.clickEvent = new RaftaClickEventHandler(this.clickHandler.bind(this));
        this.scrollEvent = new RaftaScrollEventHandler(this.scrollHandler.bind(this));
        this.visibilityChange = new RaftaUserVisibilityChangeEventHandler(this.visibilityChangeHandler.bind(this));
    }

    private checkIsUserSleep() : boolean {
        if(this.shouldPreventServerConnectOnUserSleep && !this.eventStore.eventStoreHaveLength()) {
            return false;
        }else return true;
    }

    private userFocusEvent() {
        // user can see window , but may don't focus in current tab and tab are disable in browser
        let previousFocusStatus = true; // in default set by 'true' , because when user inter in app , the tab or window is currently active and focused
        let timer = setInterval(() => {
            const hasFocusedOnCurrentDocument = document.hasFocus();
            if(hasFocusedOnCurrentDocument !== previousFocusStatus) {
                this.focusHandler(hasFocusedOnCurrentDocument);
                previousFocusStatus = hasFocusedOnCurrentDocument;
            }
        } , 1000);

        this.focusObserverId = timer;
    }

    private scrollHandler() {
        const scrollPx = window?.pageYOffset || (document?.documentElement || document?.body?.parentNode || document?.body)?.scrollTop;
        
        this.eventStore.eventDispatcher({
            data : Math.round(scrollPx)
        } , EventsKeyName.SCROLL);
    }

    private clickHandler(e : MouseEvent) {
        const targetElement = <HTMLElement>e.target;
        
        const selectedElementPath = findDOMPath(targetElement);
        const selectedElementPosition = findClickPos(e);

        this.eventStore.eventDispatcher({
            data : {
                path : selectedElementPath,
                position : selectedElementPosition,
            }
        } , EventsKeyName.CLICK);

    }

    private typeHandler(e : IRaftaKeyboardEvent) {
        this.eventStore.eventDispatcher({
            data : e,
        } , EventsKeyName.TYPE);
    }

    private mouseMoveHandler(e : MouseEvent) {
        this.eventStore.eventDispatcher({
            data : {
                position : {
                    x : e.clientX,
                    y : e.clientY,
                },
            }
        } , EventsKeyName.MOUSEMOVE);
    }

    private focusHandler(isFocused : boolean) {
        this.eventStore.eventDispatcher({
            data : isFocused,
        } , EventsKeyName.FOCUS);
    }

    private zoomHandler(ratio : number) {
        this.eventStore.eventDispatcher({
            data : ratio,
        } , EventsKeyName.ZOOM);
    }

    private resizeHandler() {
        this.eventStore.eventDispatcher({
            data : {
                viewport : {
                    height : window.innerHeight,
                    width : window.innerWidth,
                },
            }
        } , EventsKeyName.RESIZE);
    }

    private visibilityChangeHandler() {
        const visibilityState = document.visibilityState;
        this.eventStore.eventDispatcher({
            data : visibilityState,
        } , EventsKeyName.VISIBILITY_CHANGE);
    }

    private attachEventsListener() {
        this.scrollEvent.attachEventToWindow();
        this.clickEvent.attachEventToWindow();
        this.mouseMoveEvent.attachEventToWindow();
        this.keyboardEvent.attachEventToWindow();
        this.resizeEvent.attachEventToWindow();
        this.visibilityChange.attachEventToWindow();
        this.userFocusEvent();
    }

    terminateEventsListeners() {
        // kill illuminate clear de-attach terminate

        this.scrollEvent.terminateEvent();
        this.keyboardEvent.terminateEvent();
        this.mouseMoveEvent.terminateEvent();
        this.clickEvent.terminateEvent();
        this.visibilityChange.terminateEvent();
        // window.clearInterval(this.focusObserverId)
    }

    initialize() {
        this.attachEventsListener();
    }
}


export default RaftaEvent;
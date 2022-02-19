import RaftaEventStore from "./EventStore";
import { debounce, findClickPos, findDOMPath, selfClearTimeout } from "./helper/index";
import RaftaKeyboardEventHandler, { IRaftaKeyboardEvent, IRaftaKeyboardEventHandler } from "./KeyboardEvent";
import RaftaMouseMoveEventHandler, { IRaftaMouseMoveEventHandler } from "./MouseMoveEvent";
import RaftaResizeEventHandler, { IRaftaResizeEventHandler } from "./ResizeEvent";

class RaftaEvent {
    private readonly initialScrollEventListenerDelayForAttachment : number;
    private focusObserverId : NodeJS.Timer | undefined;
    private readonly scrollEventDebounce : number;
    private readonly shouldPreventServerConnectOnUserSleep : boolean;

    private keyboardEvent : IRaftaKeyboardEventHandler;
    private mouseMoveEvent : IRaftaMouseMoveEventHandler;
    private resizeEvent : IRaftaResizeEventHandler;


    // mouseEventDebounce : number;
    // resizeEventDebounce : number;

    private eventStore : RaftaEventStore;


    constructor(eventStore : RaftaEventStore) {
        this.initialScrollEventListenerDelayForAttachment = 100;
        this.scrollEventDebounce = 9;

        this.shouldPreventServerConnectOnUserSleep = true;

        this.eventStore = eventStore;
        
        this.keyboardEvent = new RaftaKeyboardEventHandler(false , this.typeHandler.bind(this));
        this.mouseMoveEvent = new RaftaMouseMoveEventHandler(this.mouseMoveHandler.bind(this));
        this.resizeEvent = new RaftaResizeEventHandler(this.resizeHandler.bind(this) , this.zoomHandler.bind(this));

    }

    private checkIsUserSleep() : boolean {
        if(this.shouldPreventServerConnectOnUserSleep && !this.eventStore.getEventsLength) {
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
        const scrollPx = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
        
        this.eventStore.eventDispatcher({
            event : "scroll",
            data : Math.round(scrollPx)
        })
    }

    private clickHandler(e : MouseEvent) {
        const targetElement = <HTMLElement>e.target;
        
        const selectedElementPath = findDOMPath(targetElement);
        const selectedElementPosition = findClickPos(e);

        this.eventStore.eventDispatcher({
            event : "click",
            data : {
                path : selectedElementPath,
                position : selectedElementPosition,
            }
        })

    }

    private typeHandler(e : IRaftaKeyboardEvent) {
        this.eventStore.eventDispatcher({
            event : "type",
            data : e,
        })
    }

    private mouseMoveHandler(e : MouseEvent) {
        this.eventStore.eventDispatcher({
            event : "mousemove",
            data : {
                position : {
                    x : e.clientX,
                    y : e.clientY,
                },
            }
        })
    }

    private focusHandler(isFocused : boolean) {
        this.eventStore.eventDispatcher({
            event : "focus",
            data : isFocused,
        })
    }

    private zoomHandler(ratio : number) {
        this.eventStore.eventDispatcher({
            event : "zoom",
            data : ratio,
        })
    }

    private resizeHandler() {
        this.eventStore.eventDispatcher({
            event : "resize",
            data : {
                viewport : {
                    height : window.innerHeight,
                    width : window.innerWidth,
                },
            }
        })
    }

    private visibilityChangeHandler() {
        const visibilityState = document.visibilityState;
        this.eventStore.eventDispatcher({
            event : "visibilityChange",
            data : visibilityState,
        })
    }

    private userScrollEvent() {
        selfClearTimeout(() => {
            document.addEventListener("scroll" , debounce(this.scrollHandler.bind(this) , this.scrollEventDebounce));
        } , this.initialScrollEventListenerDelayForAttachment);
    }

    private userClickEvent() {
        document.addEventListener("click" , this.clickHandler.bind(this));
    }

    private userVisibilityEvent() {
        // when user is not focus on page and cannot see current document
        document.addEventListener("visibilitychange" , this.visibilityChangeHandler.bind(this))
    }

    private attachEventsListener() {
        this.userScrollEvent();
        // this.userClickEvent();
        // this.mouseMoveEvent.attachEventToWindow();
        // this.keyboardEvent.attachEventToWindow();
        // this.resizeEvent.attachEventToWindow();
        // this.userFocusEvent();
        // this.userVisibilityEvent();
    }

    destroyedEventsListener() {
        // kill illuminate clear de-attach terminate
        document.removeEventListener("scroll" , this.scrollHandler);
        document.removeEventListener("click" , this.clickHandler);
        // document.removeEventListener("keydown" , this.typeHandler);
        // document.removeEventListener("mousemove" , this.mouseMoveHandler);
        // window.clearInterval(this.focusObserverId)
    }

    initialize() {
        this.attachEventsListener();
    }
}


export default RaftaEvent;
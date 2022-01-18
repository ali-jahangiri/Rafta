import RaftaEventStore from "./EventStore";
import { debounce, findClickPos, findDOMPath, selfClearTimeout } from "./helper/index";
import { TEventDispatcher } from "./interfaces/eventStoreInterface";

class RaftaEvent {
    private readonly initialScrollEventListenerDelayForAttachment : number;
    private focusObserverId : NodeJS.Timer | undefined;
    private readonly resizeDebounce : number;
    private readonly mouseMoveDebounce : number;
    private readonly scrollEventDebounce : number;
    private readonly shouldPreventServerConnectOnUserSleep : boolean;
    // mouseEventDebounce : number;
    // resizeEventDebounce : number;

    private eventStore : RaftaEventStore;


    constructor(eventStore : RaftaEventStore) {
        this.initialScrollEventListenerDelayForAttachment = 100;
        this.resizeDebounce = 100;
        this.mouseMoveDebounce = 8;
        this.scrollEventDebounce = 9;

        this.shouldPreventServerConnectOnUserSleep = true;

        this.eventStore = eventStore;
    }

    private checkIsUserSleep() : boolean {
        if(this.shouldPreventServerConnectOnUserSleep && !this.eventStore.getEventsLength) {
            return false;
        }else return true;
    }


    private userFocusEvent() {
        let previousFocusStatus = true; // in default set by 'true' , because when user inter in app , the tab or window is currently active and focused
        let timer = setInterval(() => {
            const hasFocusedOnCurrentDocument = document.hasFocus();
            if(hasFocusedOnCurrentDocument !== previousFocusStatus) {
                this.focusHandler(hasFocusedOnCurrentDocument);
                previousFocusStatus = hasFocusedOnCurrentDocument;
            }
        } , 1000);

        this.focusObserverId = timer;

        // return function unsubscribeFocusEvent() {
        //     clearInterval(timer);
        // }
    }

    private scrollHandler(e : Event) {
        const scrollPx = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;

        
        this.eventStore.eventDispatcher({
            event : "scroll",
            data : scrollPx
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

    private typeHandler(e : KeyboardEvent) {
        this.eventStore.eventDispatcher({
            event : "type",
            data : e.key,
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

    private userScrollEvent() {
        selfClearTimeout(() => {
            document.addEventListener("scroll" , debounce(this.scrollHandler.bind(this) , this.scrollEventDebounce));
        } , this.initialScrollEventListenerDelayForAttachment);
    }

    private userClickEvent() {
        document.addEventListener("click" , this.clickHandler.bind(this));
    }

    private userTypeEvent() {
        document.addEventListener("keydown" , this.typeHandler.bind(this));
    }

    private userMouseMoveEvent() {
        document.addEventListener("mousemove" , debounce(this.mouseMoveHandler.bind(this) , this.mouseMoveDebounce));
    }

    private userResizeEvent() {
        window.addEventListener("resize" , debounce(this.resizeHandler.bind(this) , this.resizeDebounce));
    }

    private attachEventsListener() {
        this.userScrollEvent();
        this.userClickEvent();
        this.userMouseMoveEvent();
        this.userTypeEvent();
        this.userResizeEvent();
        this.userFocusEvent();
    }

    destroyedEventsListener() {
        // kill illuminate clear de-attach terminate
        document.removeEventListener("scroll" , this.scrollHandler);
        document.removeEventListener("click" , this.clickHandler);
        document.removeEventListener("keydown" , this.typeHandler);
        document.removeEventListener("mousemove" , this.mouseMoveHandler);
        window.clearInterval(this.focusObserverId)
    }

    initialize() {
        this.attachEventsListener();

    }
}


export default RaftaEvent;
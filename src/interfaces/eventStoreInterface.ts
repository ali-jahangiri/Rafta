export enum EventsKeyName { 
    CLICK = "click",
    TYPE = "type",
    SCROLL = "scroll",
    MOUSEMOVE = "mouseMove",
    RESIZE = "resize",
    FOCUS = "focus",
    ERROR = "error",
    VISIBILITY_CHANGE = "visibilityChange",
    ZOOM  = "zoom"
};


export type TEventType = 
    EventsKeyName.CLICK |
    EventsKeyName.TYPE |
    EventsKeyName.SCROLL |
    EventsKeyName.MOUSEMOVE |
    EventsKeyName.RESIZE |
    EventsKeyName.FOCUS |
    EventsKeyName.ERROR |
    EventsKeyName.VISIBILITY_CHANGE |
    EventsKeyName.ZOOM;

interface IRaftaSingleEvent {
    data : any;
    time : number;
}

export interface IRaftaEventDispatcherIncomeParameters {
    data : any;
}

export type TEventListKey = 
    "clicks" |
    "types" |
    "scrolls" |
    "mouseMoves" |
    "resizes" |
    "focuses" |
    "errors" |
    "visibilityChanges" |
    "zooms";

export type TEventStore = { 
    [key in TEventListKey] : IRaftaSingleEvent[]
};

export type TPossibleEmptyEventStore = {
    [key in TEventListKey] ?: IRaftaSingleEvent[]
}

export type TEventDispatcher = (event : IRaftaEventDispatcherIncomeParameters) => void;

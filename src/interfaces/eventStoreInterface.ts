type TEventType = "click" | "type" | "scroll" | "mousemove" | "resize" | "focus" | "error" | "visibilityChange";

export interface IRaftaEventStoreEvent {
    event : TEventType;
    data : any;
    time : number;
}

export interface IRaftaEventDispatcherIncomeParameters {
    event : TEventType;
    data : any;
}

export type IRaftaEventStore = IRaftaEventStoreEvent[];


export type TEventDispatcher = (event : IRaftaEventDispatcherIncomeParameters) => void;

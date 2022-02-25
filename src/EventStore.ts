import appContext from "./AppContext";
import { generateEmptyEventStoreList, clearEmptyEventsList } from "./helper";
import { IRaftaEventDispatcherIncomeParameters, TEventStore, TEventListKey, TEventType } from "./interfaces/eventStoreInterface";

export interface IRaftaEventStoreDispatcher {
    (event : IRaftaEventDispatcherIncomeParameters) : undefined;
}


const EVENTS_GROUPING_NAME : {[key in TEventType] : TEventListKey} = {
    click : 'clicks',
    type : 'types',
    scroll : 'scrolls',
    mouseMove : 'mouseMoves',
    resize : 'resizes',
    focus : 'focuses',
    error : 'errors',
    visibilityChange : 'visibilityChanges',
    zoom : 'zooms',
}

class RaftaEventStore {
    private events : TEventStore;
    private onEventDispatchCallback : () => void;
    
    constructor() {
        this.events = appContext.getContext().eventTimeline;
        this.onEventDispatchCallback = () => {};
    }

    eventDispatcher(event : IRaftaEventDispatcherIncomeParameters) : void {
        const enhancedTargetEventWithTime = {
            ...event,
            time : Date.now()
        }
        this.events[EVENTS_GROUPING_NAME[enhancedTargetEventWithTime.event]].push(enhancedTargetEventWithTime);
        this.onEventDispatchCallback();
    }

    getEntire() {
        const entireStoreCloned = { ...this.events };
        this.clearEventStore();
        return clearEmptyEventsList(entireStoreCloned);
    }

    getEventsLength() {
        
    }

    onEventDispatching(callback : () => void) {
        this.onEventDispatchCallback = callback;
    }

    private clearEventStore() {
        this.events = generateEmptyEventStoreList();
    }
}


export default RaftaEventStore;
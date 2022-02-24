import appContext from "./AppContext";
import { IRaftaEventStore, IRaftaEventDispatcherIncomeParameters } from "./interfaces/eventStoreInterface";

export interface IRaftaEventStoreDispatcher {
    (event : IRaftaEventDispatcherIncomeParameters) : undefined;
}

class RaftaEventStore {
    private events : IRaftaEventStore;
    private onEventDispatchCallback : () => void;
    
    constructor() {
        const { eventTimeline } = appContext.getContext()
        this.events = eventTimeline;

        this.onEventDispatchCallback = () => {};
    }

    eventDispatcher(event : IRaftaEventDispatcherIncomeParameters) : void {
        const enhancedTargetEventWithTime = {
            ...event,
            time : Date.now()
        }
        this.events.push(enhancedTargetEventWithTime);
        this.onEventDispatchCallback();
    }

    getEntire() {
        const entireStoreCloned = [...this.events];
        this.clearEventStore();
        return entireStoreCloned;
    }

    getEventsLength() {
        return this.events.length;
    }

    onEventDispatching(callback : () => void) {
        this.onEventDispatchCallback = callback;
    }

    private clearEventStore() {
        this.events = [];
    }
}


export default RaftaEventStore;
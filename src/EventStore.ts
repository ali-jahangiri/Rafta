import appContext from "./AppContext";
import { IRaftaEventStore, IRaftaEventDispatcherIncomeParameters } from "./interfaces/eventStoreInterface";

export interface IRaftaEventStoreDispatcher {
    (event : IRaftaEventDispatcherIncomeParameters) : undefined;
}

class RaftaEventStore {
    private events : IRaftaEventStore;
    
    constructor() {
        const { eventTimeline } = appContext.getContext()
        this.events = eventTimeline;
    }

    eventDispatcher(event : IRaftaEventDispatcherIncomeParameters) : IRaftaEventStoreDispatcher {
        const enhancedTargetEventWithTime = {
            ...event,
            time : Date.now()
        }
        this.events.push(enhancedTargetEventWithTime);
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
        
    }

    private clearEventStore() {
        this.events = [];
    }
}


export default RaftaEventStore;
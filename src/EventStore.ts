import { IRaftaEventStore, IRaftaEventDispatcherIncomeParameters } from "./interfaces/eventStoreInterface";

class RaftaEventStore {
    private events : IRaftaEventStore;
    
    constructor() {
        this.events = [];
    }

    eventDispatcher(event : IRaftaEventDispatcherIncomeParameters) {
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

    private clearEventStore() {
        this.events = [];
    }
}


export default RaftaEventStore;
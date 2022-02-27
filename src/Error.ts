import RaftaEventStore from "./EventStore";
import { createErrorFileName } from "./helper/index";
import { EventsKeyName } from "./interfaces/eventStoreInterface";

class RaftaError {
    private eventStore : RaftaEventStore;

    constructor(eventStore : RaftaEventStore) {
        this.eventStore = eventStore;
    }

    private errorObserverHandler(e : ErrorEvent) {
        this.eventStore.eventDispatcher({
            event : EventsKeyName.ERROR,
            data : {
                fileName : createErrorFileName(e),
                stack : e.error.stack,
                message : e.message
            }
        })
    }

    private errorObserver() {
        window.addEventListener("error" , this.errorObserverHandler.bind(this));
    }

    initialize() {
        this.errorObserver();
    }
}


export default RaftaError;
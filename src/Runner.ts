import RaftaError from "./Error";
import RaftaEvent from "./Event";
import RaftaEventStore from "./EventStore";
import RaftaRequest from "./Request";
import RaftaUser from "./User";

// a middleware worker for setup main Rafta class
class RaftaRunner {
    private error : RaftaError;
    private request : RaftaRequest;
    private event : RaftaEvent;

    eventStore : RaftaEventStore;

    constructor() {
        this.eventStore = new RaftaEventStore();
        this.request = new RaftaRequest();
        this.error = new RaftaError(this.eventStore);
        this.event = new RaftaEvent(this.eventStore);
    }

    beforeDOMLoadSetup(packageName : string) {
        // this.request.initialPackageRequest(packageName)
        //     .then(() => {
        //         const { getEntireUserData } = new RaftaUser();
        //         const entireUserInitialData = getEntireUserData();
        //         this.request.identifyUserRequest(entireUserInitialData);
        //     })
            this.request.overrideBrowserFetcher();
    }

    afterDOMLoadSetup = () => {
        this.event.initialize();
        this.error.initialize();
    }

    timePeriodSetup = () => {
        // console.log(this.eventStore.getEntire());
        
    }
}

export default RaftaRunner;
import RaftaError from "./Error";
import RaftaEvent from "./Event";
import RaftaEventStore from "./EventStore";
import RaftaPerformance from "./Performance";
import RaftaRequest from "./Request";
import RaftaUser from "./User";

import appContext from "./AppContext";

// a middleware worker for setup main Rafta class
class RaftaRunner {
    private error : RaftaError;
    private request : RaftaRequest;
    private event : RaftaEvent;
    private performance : RaftaPerformance;

    eventStore : RaftaEventStore;

    constructor() {
        this.eventStore = new RaftaEventStore();
        this.request = new RaftaRequest();
        this.error = new RaftaError(this.eventStore);
        this.event = new RaftaEvent(this.eventStore);
        this.performance = new RaftaPerformance();
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
        this.performance.afterDOMLoadObservation();
    }


    afterFullLoadSetup = () =>{
        this.performance.afterLoadObservation();
    }


    timePeriodSetup = () => {
        
    }
}

export default RaftaRunner;
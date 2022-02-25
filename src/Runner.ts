import appContext from "./AppContext";
import RaftaAuth from "./Authentication/auth";
import RaftaError from "./Error";
import RaftaEvent from "./Event";
import RaftaEventStore from "./EventStore";
import { debounce, sessionInContext } from "./helper";
import RaftaPerformance from "./Performance";
import RaftaRequest from "./Request";
import RaftaSession from "./Session";
import RaftaUser from "./User";


class RaftaRunner<T> {
    private error : RaftaError;
    private request : RaftaRequest;
    private event : RaftaEvent;
    private user : RaftaUser;
    private performance : RaftaPerformance<T>;
    private session : RaftaSession;

    eventStore : RaftaEventStore;
    authentication : RaftaAuth;

    constructor() {
        this.session = new RaftaSession();

        this.eventStore = new RaftaEventStore();
        this.request = new RaftaRequest();
        this.error = new RaftaError(this.eventStore);
        this.event = new RaftaEvent(this.eventStore);
        this.performance = new RaftaPerformance();
        this.authentication = new RaftaAuth();
        this.user = new RaftaUser();
    }

    beforeDOMLoadSetup(packageName : string) {
        const { set : setSessionInContext } = sessionInContext();

        setSessionInContext(this.session.createSession());
        this.session.periodicalSessionUpdate(setSessionInContext);

        const debouncedSessionUpdateHandler = debounce(this.session.updateSession , 250);
        this.eventStore.onEventDispatching(debouncedSessionUpdateHandler);

        // this.authentication.authorizeUser();

        // // this.request.initialPackageRequest(packageName)
        // //     .then(() => {
        // //         const { getEntireUserData } = new RaftaUser();
        // //         const entireUserInitialData = getEntireUserData();
        // //         this.request.identifyUserRequest(entireUserInitialData);
        // //     })
        // this.request.overrideBrowserFetcher();
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
        // console.log();this.eventStore.getEntire()
        console.log(this.eventStore.getEntire());
    }
}

export default RaftaRunner;
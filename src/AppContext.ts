import Context from "./Context/Context";
import { IRaftaEventStore } from "./interfaces/eventStoreInterface";
import { TRaftaPerformanceTimeline } from "./Performance";

interface IRaftaAppLevelContext {
    eventTimeline : IRaftaEventStore,
    performanceTimeline : TRaftaPerformanceTimeline;
}

const appContext = new Context<IRaftaAppLevelContext>();

appContext.createContext({
    eventTimeline : [],
    performanceTimeline : [],
});

export default appContext;
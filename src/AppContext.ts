import Context from "./Context/Context";
import { IRaftaEventStore } from "./interfaces/eventStoreInterface";
import { IRaftaPerformanceTimeline } from "./Performance";

interface IRaftaAppLevelContext<T , U> {
    eventTimeline : IRaftaEventStore,
    performanceTimeline : IRaftaPerformanceTimeline<T , U>;
}

const appContext = new Context<IRaftaAppLevelContext>();

appContext.createContext({
    eventTimeline : [],
    performanceTimeline : {
        initialResource : [],
        initialLoadMetrics : [],
    }
});

export default appContext;
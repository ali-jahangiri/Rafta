import Context from "./Context/Context";
import { IRaftaEventStore } from "./interfaces/eventStoreInterface";
import { IRaftaPerformanceTimeline } from "./Performance";

interface IRaftaAppLevelContext<T> {
    eventTimeline : IRaftaEventStore,
    performanceTimeline : IRaftaPerformanceTimeline<T>;
}

const appContext = new Context({
    eventTimeline : [],
    performanceTimeline : {
        initialResource : [],
        initialLoadMetrics : [],
    }
});

export default appContext;
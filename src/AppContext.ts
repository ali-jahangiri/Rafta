import Context from "./Context/Context";
import { generateEmptyEventStoreList } from "./helper";

const appContext = new Context({
    eventTimeline : generateEmptyEventStoreList(),
    performanceTimeline : {
        initialResource : [],
        initialLoadMetrics : [],
    },
    sessionId : "",
});

export default appContext;
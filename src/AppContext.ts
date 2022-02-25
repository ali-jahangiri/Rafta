import Context from "./Context/Context";

const appContext = new Context({
    eventTimeline : [],
    performanceTimeline : {
        initialResource : [],
        initialLoadMetrics : [],
    },
    sessionId : "",
});

export default appContext;
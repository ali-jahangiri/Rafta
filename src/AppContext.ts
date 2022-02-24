import Context from "./Context/Context";

const appContext = new Context({
    eventTimeline : [],
    performanceTimeline : {
        initialResource : [],
        initialLoadMetrics : [],
    }
});

export default appContext;
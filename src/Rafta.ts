import RaftaLifecycle from "./Lifecycle";
import RaftaRunner from "./Runner";

class Rafta {
    lifecycle : RaftaLifecycle;
    runner : RaftaRunner;
    
    constructor() {
        this.lifecycle = new RaftaLifecycle();
        this.runner = new RaftaRunner();
    }

    init(packageName : string) {
        this.lifecycle.beforeDOMLoad(() => this.runner.beforeDOMLoadSetup(packageName));
        this.lifecycle.afterDOMLoad(this.runner.afterDOMLoadSetup);
        this.lifecycle.timePeriod(this.runner.timePeriodSetup);
    }
}

export default Rafta;
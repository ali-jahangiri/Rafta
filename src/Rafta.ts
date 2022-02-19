import RaftaLifecycle from "./Lifecycle";
import RaftaRunner from "./Runner";

class Rafta<T> {
    lifecycle : RaftaLifecycle;
    runner : RaftaRunner<T>;
    
    constructor() {
        this.lifecycle = new RaftaLifecycle();
        this.runner = new RaftaRunner();
    }

    init(packageName : string) {
        this.lifecycle.beforeDOMLoad(() => this.runner.beforeDOMLoadSetup(packageName));
        this.lifecycle.afterDOMLoad(this.runner.afterDOMLoadSetup);
        this.lifecycle.afterFullDocumentLoad(this.runner.afterFullLoadSetup);
        this.lifecycle.timePeriod(this.runner.timePeriodSetup);
    }
}

export default Rafta;
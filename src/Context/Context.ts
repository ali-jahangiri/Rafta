class Context<U extends Object> {
    private contextHolder : U;

    constructor(defaultValues : U) {
        this.contextHolder = defaultValues;
    }

    createContext(defaults : U) {
        this.contextHolder = defaults;
    }

    getContext() {
        return this.contextHolder;
    }
}


export default Context;
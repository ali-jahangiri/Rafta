class Context<U extends Object> {
    private contextHolder : U;

    constructor(defaultValues : U) {
        this.contextHolder = defaultValues;
    }

    getContext() {
        return this.contextHolder;
    }
}


export default Context;
class Context<U extends {}> {
    private contextHolder : U;

    constructor(defaultValues : U) {
        this.contextHolder = defaultValues;
    }

    getContext() {
        return this.contextHolder;
    }
}


export default Context;
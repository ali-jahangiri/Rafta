class RaftaNetworkError extends Error {
    constructor(message : string) {
        super(message);
    }
}

export default RaftaNetworkError;
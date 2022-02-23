import { decodeSessionId, generateSessionId, validateSessionSchema } from "./helper";


const SESSION_IDENTIFIER_KEY = "userSession";
const SESSION_EXPIRE_MINUTE_TIME = 3;


type TSessionStoredTime = number;
type TSessionIdInLocalStorage = string | null;

class RaftaSession {
    private sessionIdInLocalStorage : TSessionIdInLocalStorage;

    constructor() {
        this.sessionIdInLocalStorage = null;
    }

    private getSessionFromLocalStorage() : TSessionIdInLocalStorage {
        const sessionId = window.localStorage.getItem(SESSION_IDENTIFIER_KEY);
        this.sessionIdInLocalStorage = sessionId;
        return sessionId;
    }

    private checkIsSessionExpired(session : TSessionStoredTime) {
        const currentTime = Date.now();
        const diff = (currentTime - session) / 60000;
        
        if(diff <= SESSION_EXPIRE_MINUTE_TIME) return false;
        else return true;
    }

    private checkIsSessionExist() : string | null {
        const session = this.getSessionFromLocalStorage();
        if(session) return session;
        else return null;
    }

    private validateSession() {
        const session = this.checkIsSessionExist();
        if(session) {
            if(validateSessionSchema(session)) {
                const decodedSessionId = decodeSessionId(session);
                const wasSessionExpired = this.checkIsSessionExpired(decodedSessionId);
                return wasSessionExpired ? false : true;
            }else return false;

        }else return false;
    }

    private checkSessionRuntimeDestructionListener() {
        // let timer = setInterval(() => {
        //     console.log(window.localStorage.getItem(SESSION_IDENTIFIER_KEY));
            
        // } , 10);
    }

    createSession() : string {
        const haveValidSession = this.validateSession();

        
        if(haveValidSession && this.sessionIdInLocalStorage) {
            // return current existing active session
            // this.checkSessionRuntimeDestructionListener();
            return this.sessionIdInLocalStorage;
        }else {
            // have to create or renew session
            const sessionId = generateSessionId();
            window.localStorage.setItem(SESSION_IDENTIFIER_KEY , sessionId);
            // this.checkSessionRuntimeDestructionListener();
            return sessionId;
        }
        
    }

    periodicalSessionUpdate() {

    }

}


export default RaftaSession;
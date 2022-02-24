import { decodeSessionId, extractIdFromSession, generateSessionId, updateSessionTime, validateSessionSchema } from "./helper";


const SESSION_IDENTIFIER_KEY = "userSession";
const SESSION_EXPIRE_MINUTE_TIME = 3;
// const SLEEP_TIME_FOR_LISTENER_ATTACHMENT = 120000;
const SLEEP_TIME_FOR_LISTENER_ATTACHMENT = 10000;


type TSessionStoredTime = number;
type TSessionIdInLocalStorage = string | null;

class RaftaSession {
    private sessionIdInLocalStorage : TSessionIdInLocalStorage;
    private gapTimeBetweenAutoSessionUpdate : number;
    // private periodicalSessionUpdate : { id };

    constructor() {
        this.sessionIdInLocalStorage = null;
        this.gapTimeBetweenAutoSessionUpdate = SLEEP_TIME_FOR_LISTENER_ATTACHMENT;

        this.updateSession = this.updateSession.bind(this);
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

    private periodicalSessionUpdate() {
        console.log('listener' , this.gapTimeBetweenAutoSessionUpdate);
        
        let timer = setTimeout(() => {
            let intervalTimer = setInterval(() => {
                // this.updateSession();
                console.log('update');
            } , 100);
        } , this.gapTimeBetweenAutoSessionUpdate);
    }

    createSession() : string {
        const haveValidSession = this.validateSession();
        this.periodicalSessionUpdate();
        
        if(haveValidSession && this.sessionIdInLocalStorage) {
            // return current existing active session
            return this.sessionIdInLocalStorage;
        }else {
            // have to create or renew session
            const sessionId = generateSessionId();
            window.localStorage.setItem(SESSION_IDENTIFIER_KEY , sessionId);
            return sessionId;
        }

    }

    private onSessionUpdate() {
        this.gapTimeBetweenAutoSessionUpdate = SLEEP_TIME_FOR_LISTENER_ATTACHMENT;
    }

    updateSession() {
        // check for existence of session , if session destroyed we have to create new one
        const prevStoredSession = this.getSessionFromLocalStorage();
        if(prevStoredSession && validateSessionSchema(prevStoredSession)) {
            const newTimeUpdatedSession = updateSessionTime(prevStoredSession);
            window.localStorage.setItem(SESSION_IDENTIFIER_KEY , newTimeUpdatedSession);
        }else this.createSession();
        this.onSessionUpdate();
    }

}


export default RaftaSession;
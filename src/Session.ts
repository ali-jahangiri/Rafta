import { extractTimeFromSession, extractIdFromSession, generateSessionId, updateSessionTime, validateSessionSchema } from "./helper";


const SESSION_IDENTIFIER_KEY = "userSession";
const SESSION_EXPIRE_MINUTE_TIME = 3;
const SLEEP_TIME_FOR_LISTENER_ATTACHMENT = 120000;


type TSessionStoredTime = number;
type TSessionIdInLocalStorage = string | null;

class RaftaSession {
    private sessionIdInLocalStorage : TSessionIdInLocalStorage;
    private gapTimeBetweenAutoSessionUpdate : number;
    private periodicalSessionTimerId : NodeJS.Timer | undefined;

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
                const decodedSessionId = extractTimeFromSession(session);
                const wasSessionExpired = this.checkIsSessionExpired(decodedSessionId);
                return wasSessionExpired ? false : true;
            }else return false;

        }else return false;
    }

    // onSessionDestroyedInRuntime(callback : (newSession : string) => void) {
    //     callback();
    // }

    periodicalSessionUpdate(onSessionReCreation : (newSession : string) => void) {
        this.periodicalSessionTimerId = setInterval(() => {
            if(this.gapTimeBetweenAutoSessionUpdate > 0) {
                this.gapTimeBetweenAutoSessionUpdate -= 1000;
            }else {
                const haveNewReCreatedSession = this.updateSession();
                if(haveNewReCreatedSession) onSessionReCreation(haveNewReCreatedSession);
            };
        } , 1000);
    }

    private clearPeriodicalSessionUpdateHandler() {
        clearInterval(this.periodicalSessionTimerId as NodeJS.Timer);
    }

    createSession() : string {
        const haveValidSession = this.validateSession();

        let finallyReturnSession : string | undefined;
        
        if(haveValidSession && this.sessionIdInLocalStorage) {
            // return current existing active session
            finallyReturnSession =  this.sessionIdInLocalStorage;
        }else {
            // have to create or renew session
            const sessionId = generateSessionId();
            window.localStorage.setItem(SESSION_IDENTIFIER_KEY , sessionId);
            finallyReturnSession = sessionId;
        }

        return extractIdFromSession(finallyReturnSession);
    }

    private onSessionUpdate() {
        this.gapTimeBetweenAutoSessionUpdate = SLEEP_TIME_FOR_LISTENER_ATTACHMENT;
    }

    updateSession() : string | undefined {
        this.onSessionUpdate();

        const prevStoredSession = this.getSessionFromLocalStorage();
        if(prevStoredSession && validateSessionSchema(prevStoredSession)) {
            const newTimeUpdatedSession = updateSessionTime(prevStoredSession);
            window.localStorage.setItem(SESSION_IDENTIFIER_KEY , newTimeUpdatedSession);
        }else return this.createSession();
    }

}


export default RaftaSession;
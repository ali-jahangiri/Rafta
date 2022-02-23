import { nanoid } from "nanoid";
import { generateId } from "./helper";

const SESSION_IDENTIFIER_KEY = "userSession";
const SESSION_EXPIRE_MINUTE_TIME = 3;



type TSessionStorage = number;

class RaftaSession {
    constructor() {

    }


    private checkSessionExpiration(session : TSessionStorage) {
        const currentTime = Date.now();
        const diff = (currentTime - session) / 60000;
        
        if(diff <= SESSION_EXPIRE_MINUTE_TIME) return false;
        else return true;
    }


    private checkIsSessionExist() : TSessionStorage | null {
        const session = window.localStorage.getItem(SESSION_IDENTIFIER_KEY);
        if(session) return Number(session);
        else return null;
    }

    private validateSession() {
        const session = this.checkIsSessionExist();
        if(session) {
            const wasSessionExpired = this.checkSessionExpiration(session);
            return wasSessionExpired ? false : true;
        }else return false;
    }

    createSession() : TSessionStorage {
        const haveValidSession = this.validateSession();
        if(haveValidSession) {
            const et = new Array(1000).fill("").map(() => nanoid(6))
            console.log(et);
            
        }else {
            // have to create or renew session
            const currentTime = Date.now();
            window.localStorage.setItem(SESSION_IDENTIFIER_KEY , `${currentTime}`);
            return currentTime;
        }
        
    }


}


export default RaftaSession;
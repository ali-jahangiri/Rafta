import Cookies from "js-cookie";
import { generateId } from "../helper";
class RaftaAuth {
    constructor() {

    }

    private checkUserAuth() {
        return Cookies.get("_uId");
    }

    authorizeUser() {
        const userIdCookie = this.checkUserAuth();
        if(!userIdCookie) {
            Cookies.set("_uId" , generateId() , { expires : 365 })
        }else {
            return userIdCookie;
        }
    }


    getUserId() {
        return this.checkUserAuth();
    }
    
}


export default RaftaAuth;
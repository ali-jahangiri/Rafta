import Cookies from "js-cookie";

class RaftaAuth {
    constructor() {

    }

    private checkUserAuth() {
        return Cookies.get("_uId");
    }

    authorizeUser() {
        const userIdCookie = this.checkUserAuth();
        if(!userIdCookie) {
            
        }else {
            return userIdCookie;
        }
    }


    getUserId() {
        return this.checkUserAuth();
    }
    
}


export default RaftaAuth;
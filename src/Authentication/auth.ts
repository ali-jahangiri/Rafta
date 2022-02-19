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
            Cookies.set("_uId" , 'minima-similique-qui' , { expires : 365 })
        }else {
            return userIdCookie;
        }
    }
    
}


export default RaftaAuth;
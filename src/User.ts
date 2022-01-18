import { 
    IBrowserDetailsMethod,
    IUserLocation,
    IUserLocationFailed,
    TUserDevice,
    IUserViewportMethod,
    IUserEntireData,
} from "./interfaces/UserInterface";


class RaftaUser {

    getBrowserPath() {
        const path = window.location.href;
        return path;
    }

    getBrowserDetails() : IBrowserDetailsMethod {
        var N= navigator.appName, ua= navigator.userAgent, tem;
        var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) {M[2]=tem[1];}
        M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
        
        const [name , version] = M;
        return { name , version }
    }

    getBrowserViewport() : IUserViewportMethod {
        return {
            height : window.innerHeight,
            width : window.innerWidth,
        }
    }

    getUserLocation() : Promise<IUserLocation | IUserLocationFailed> | null {
        if(navigator?.geolocation) {
            return new Promise<IUserLocation | IUserLocationFailed>((resolve , reject) => {
                const onAccessLocationHandler = (e : GeolocationPosition) => {
                    resolve({
                        location : {
                            latitude : e.coords.latitude ,
                            longitude : e.coords.longitude
                        }, 
                        timestamp : e.timestamp,
                    })
                }
    
                const onAccessDeniedHandler = (e : GeolocationPositionError) => reject({ code : e.code , message : e.message });
                navigator.geolocation.getCurrentPosition(onAccessLocationHandler , onAccessDeniedHandler)
            })



        }else return null;
    }

    getUserOSName() : string {
        let userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = "";
  
        if (macosPlatforms.indexOf(platform) !== -1) os = 'Mac OS';
        else if (iosPlatforms.indexOf(platform) !== -1) os = 'iOS';
        else if (windowsPlatforms.indexOf(platform) !== -1) os = 'Windows';
        else if (/Android/.test(userAgent)) os = 'Android';
        else if (!os && /Linux/.test(platform)) os = 'Linux';

        return os;
    }

    checkCookieStatus() : boolean {
        let cookieEnabled = !!navigator.cookieEnabled;
        
        if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        return cookieEnabled;
    }

    getUserDevice() : TUserDevice {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            return "phone"
        }else return "desktop"
    }

    getEntireUserData = () : IUserEntireData => {
        return {
            browser :  {
                path : this.getBrowserPath(),
                details : this.getBrowserDetails(),
                viewport : this.getBrowserViewport(),
                cookie : this.checkCookieStatus()
            },
            user : {
                device : this.getUserDevice(),
                osName : this.getUserOSName(),
            }
        }
    }
}


export default RaftaUser;
import { debounce, deepClone, findDOMPath, selfClearTimeout } from "./helper/index";

interface IBrowserDetailsMethod {
    version : number | string;
    name : string;
}

interface IUserViewportMethod {
    width : number;
    height : number;
}

interface IUserLocation {
    location : {
        latitude : number;
        longitude : number;
    } | "User denied Geolocation";
    timestamp : number;
}

interface IUserLocationFailed {
    code : number;
    message : string;
}

type TUserDevice = "phone" | "desktop" | "unknown";

interface IRaftaUserData {
    OSName : string;
    device : TUserDevice;
    isCookieEnable : boolean;
    browser : IBrowserDetailsMethod;
}

type TEventType = "click" | "type" | "scroll" | "mousemove"

interface IRaftaEvent {
    timestamp : number;
    event : TEventType;
    data : any;
}

interface IRaftaEventStore {
    events : IRaftaEvent[]
}

interface IPageInitialData {
    path : string;
    pageHeight : number;

}



class Rafta {
    user : IRaftaUserData;
    page : IPageInitialData;
    eventStore : IRaftaEventStore;
    syncTimeout : number;
    syncTimerId : number | undefined;
    // mouseEventDebounce : number;
    // resizeEventDebounce : number;
    scrollEventDebounce : number;
    mouseMoveDebounce : number;
    initialScrollEventListenerDelayForAttachment : number;
    shouldPreventServerConnectOnUserSleep : boolean;


    constructor() {
        this.user = {
            OSName : "",
            browser : { name : "" , version : "" },
            device : "unknown",
            isCookieEnable : false,
        }

        this.initialScrollEventListenerDelayForAttachment = 100;
        this.syncTimeout = 3000;
        this.scrollEventDebounce = 9;
        this.mouseMoveDebounce = 8;
        this.shouldPreventServerConnectOnUserSleep = true;

        this.eventStore = { events : [] };
        this.page = { path : "" , pageHeight : 0 };
    }

    getBrowserDetails() : IBrowserDetailsMethod {
        var N= navigator.appName, ua= navigator.userAgent, tem;
        var M= ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
        if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) {M[2]=tem[1];}
        M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
        
        const [name , version] = M;
        return { name , version }
    }

    getUserViewport() : IUserViewportMethod {
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

    getPageInitialData() : IPageInitialData {
        const path = location.href;
        const pageHeight = document?.documentElement?.clientHeight;

        return {
            pageHeight,
            path,
        }
    }


    initializer() {
        // send initial user and page data
        // set all event for entire app workflow
        // invoke lifecycle method

        this.sendInitialData();
        this.attachEventsListener();
        this.mountSync();
    }


    sendInitialData() {

        const page = this.getPageInitialData();

        const requestPayload = {
            OSName : this.getUserOSName(),
            device : this.getUserDevice(),
            isCookieEnable : this.checkCookieStatus(),
            browser : this.getBrowserDetails(),
            page,
        }

        this.user = requestPayload;
        this.page = page;

        // user session id gonna return form server in this connection
    }

    
    mountSync() {
        console.log('MOUNT');
        
        let timer = window.setInterval(() => {
            if(this.checkIsUserSleep()) {
                this.syncToServer(deepClone(this.eventStore));
                this.clearEventStore();
            }
        } , this.syncTimeout);
        this.syncTimerId = timer;
    }


    unMountSync() {
        window.clearInterval(this.syncTimerId);
        this.destroyedEventsListener();
        this.clearEventStore();
    }

    // setEventStore(newEventStore : IRaftaEventStore) {
    //     this.eventStore = deepClone(newEventStore);
    // }

    // getEventStore() {
    //     return this.eventStore;
    // }

    checkIsUserSleep() : boolean {
        if(this.shouldPreventServerConnectOnUserSleep && !this.eventStore.events.length) {
            return false;
        }else return true;
    }

    private syncToServer(events : IRaftaEventStore) {
        // send data to server
        console.log(events , 'events');
        
    }
    
    private eventDispatcher(targetEvent : IRaftaEvent) {
        this.eventStore.events.push(targetEvent);
    }


    private clearEventStore() {
        // clear temp event store in class in unMont lifecycle method and each sync with server
        this.eventStore.events = [];
    }

    scrollHandler(e : Event) {
        const scrollPx = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;

        
        this.eventDispatcher({
            timestamp : Date.now(),
            event : "scroll",
            data : scrollPx
        })
    }

    clickHandler(e : MouseEvent) {
        const targetElement = <HTMLElement>e.target;
        
        const selectedElementPath = findDOMPath(targetElement);
        
        this.eventDispatcher({
            event : "click",
            timestamp : Date.now(),
            data : {
                path : selectedElementPath,
            }
        })

    }

    typeHandler(e : Event) {
        // console.log('typed');
    }

    mouseMoveHandler(e : MouseEvent) {
        
        this.eventDispatcher({
            event : "mousemove",
            timestamp : Date.now(),
            data : {
                position : {
                    x : e.clientX,
                    y : e.clientY,
                },
            }
        })
    }

    resizeHandler() {
        // console.log('resize');
    }

    userScrollEvent() {
        selfClearTimeout(() => {
            document.addEventListener("scroll" , debounce(this.scrollHandler.bind(this) , this.scrollEventDebounce));
        } , this.initialScrollEventListenerDelayForAttachment);
    }


    userClickEvent() {
        document.addEventListener("click" , this.clickHandler.bind(this));
    }

    userTypeEvent() {
        document.addEventListener("keydown" , this.typeHandler);
    }

    userMouseMoveEvent() {
        document.addEventListener("mousemove" , debounce(this.mouseMoveHandler.bind(this) , this.mouseMoveDebounce));
    }

    userResizeEvent() {
        document.addEventListener("resize" , this.resizeHandler);
    }

    attachEventsListener() {
        this.userScrollEvent();
        this.userClickEvent();
        this.userMouseMoveEvent();
        // this.userTypeEvent();
    }

    destroyedEventsListener() {
        // kill illuminate clear de-attach
        document.removeEventListener("scroll" , this.scrollHandler);
        document.removeEventListener("click" , this.clickHandler);
        document.removeEventListener("keydown" , this.typeHandler);
        document.removeEventListener("mousemove" , this.mouseMoveHandler)
    }
}

export default Rafta;

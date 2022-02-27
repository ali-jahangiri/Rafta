import { debounce } from "../helper/index";

class RaftaResizeEventHandler {
    private readonly resizeDebounce : number;
    private initialUserZoomLevel : number;
    
    constructor(private resizeEventDispatcher : () => void , private zoomEventDispatcher : (ratio : number) => void) {
        this.resizeDebounce = 100;

        this.initialUserZoomLevel = this.detectUserZoomLevel();

        this.resizeEventDispatcher = resizeEventDispatcher;
        this.zoomEventDispatcher = zoomEventDispatcher;
    }


    private detectUserZoomLevel() {
        return Math.round((window.outerWidth / window.innerWidth) * 100)
    }

    private resizeHandler() {
        // const currentZoomLevel = this.detectUserZoomLevel();
        
        // if(currentZoomLevel !== this.initialUserZoomLevel) {
        //     this.zoomEventDispatcher(currentZoomLevel);
        //     this.initialUserZoomLevel = currentZoomLevel;
        // }else {
        // }
        this.resizeEventDispatcher();
    }

    attachEventToWindow() {
        window.addEventListener("resize" , debounce(this.resizeHandler.bind(this) , this.resizeDebounce));
    }

    terminateEvent() {
        
    }
}


export default RaftaResizeEventHandler;
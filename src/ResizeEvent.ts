import { debounce } from "./helper/index";

export interface IRaftaResizeEventHandler {
    attachEventToWindow : () => void;
}

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
        let screenCssPixelRatio = ((window.outerWidth - 8) / window.innerWidth);
        console.log(screenCssPixelRatio);
        

        return Math.round((window.outerWidth / window.innerWidth) * 100)
    }

    private resizeHandler() {
        const currentZoomLevel = this.detectUserZoomLevel();
        console.log(currentZoomLevel);
        
        
        if(currentZoomLevel !== this.initialUserZoomLevel) {
            this.zoomEventDispatcher(currentZoomLevel);
            // this.initialUserZoomLevel = currentZoomLevel;
        }else {
            this.resizeEventDispatcher();
        }
    }

    attachEventToWindow() {
        window.addEventListener("resize" , debounce(this.resizeHandler.bind(this) , this.resizeDebounce));
    }

}


export default RaftaResizeEventHandler;
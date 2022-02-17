import { axisProgressCalculator, debounce, detectAxisOutOfSafArea } from "./helper/index";

export interface IRaftaMouseMoveEventHandler {
    attachEventToWindow : () => void;
}

interface ILastSettledPoint {
    x : number;
    y : number;
}

type TParentEventDispatcher = (e : MouseEvent) => void;

class RaftaMouseMoveEventHandler {
    private readonly mouseMoveDebounce : number;
    private lastSettledPoint : ILastSettledPoint | undefined;
    private parentEventDispatcher : TParentEventDispatcher;
    private safeAreaSize : number;

    
    constructor(parentEventDispatcher : TParentEventDispatcher) {
        this.mouseMoveDebounce = 15;
        this.safeAreaSize = 50;
        this.parentEventDispatcher = parentEventDispatcher;
    }

    private attachPointHandler(currentPosition : ILastSettledPoint , e : MouseEvent) {
        this.parentEventDispatcher(e);
        this.lastSettledPoint = currentPosition;
        
        // visual debugging helper
        
        // const div = document.createElement("div");
        // div.classList.add("customAreaBox");
        // div.style.left = `${currentPosition.x - (this.safeAreaSize / 2)}px`;
        // div.style.top = `${currentPosition.y - (this.safeAreaSize / 2)}px`;
        // document.body.style.overflow = "hidden";
        // document.body.appendChild(div);
    }

    private mouseMoveHandler(e : MouseEvent) {
        const currentPosition = {
            x : e.clientX ,
            y : e.clientY
        }

        if(!this.lastSettledPoint) this.attachPointHandler(currentPosition , e);
        else {
            const calcX = axisProgressCalculator(this.lastSettledPoint.x , this.safeAreaSize , currentPosition.x);
            const xAxisOutOfSafeArea = detectAxisOutOfSafArea(calcX , this.safeAreaSize);
            
            const calcY = axisProgressCalculator(this.lastSettledPoint.y , this.safeAreaSize , currentPosition.y);
            const yAxisOutOfSafeArea = detectAxisOutOfSafArea(calcY , this.safeAreaSize);

            if(xAxisOutOfSafeArea || yAxisOutOfSafeArea) this.attachPointHandler(currentPosition , e);
            
        }
    }

    attachEventToWindow() {
        const debouncedCallback = debounce(this.mouseMoveHandler.bind(this) , this.mouseMoveDebounce);
        document.addEventListener("mousemove" , debouncedCallback);
    }
}


export default RaftaMouseMoveEventHandler;
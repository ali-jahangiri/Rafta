import { IRaftaKeyboardEvent } from "../KeyboardEvent";

export function clientChecker() : boolean {
    if(typeof window !== "undefined" && typeof document !== "undefined") {
        return true
    }else return false;
}


export const debounce = (func: Function , wait : number) => {
    let timeoutId : number | null | undefined;
    return function executedFunction(...args : []) {
        const later = () => {
        timeoutId = null;
        func(...args);
        };
        clearTimeout(timeoutId as number);
        timeoutId = window.setTimeout(later, wait);
    };
};


export function selfClearTimeout(callback : Function , timeout : number) {
    let timer = window.setTimeout(() => {
        callback();
        window.clearTimeout(timer);
    } , timeout);
}


export function deepClone(object : Object) {
    return JSON.parse(JSON.stringify(object));
}


function detectElementIdentifier(element : HTMLElement) {
    if(element.id) {
        return `#${element.id}`
    }
    else if(element.className) {
        return `.${element.className}`
    }else return "";
}

export function findDOMPath(element : HTMLElement | Node) : string {
    const pathStack = [];
    
    return (function innerRecursive(parentNode : HTMLElement) {
        if(parentNode?.parentElement) {
            const currentElementName = (() => {
                const elementTag = parentNode.tagName.toLowerCase();
                return `${elementTag}${detectElementIdentifier(parentNode)}`
            })();

            pathStack.push(currentElementName);
            innerRecursive(parentNode.parentElement);
        }
        return pathStack;
    })(element).reverse().join(" ");
}


export function findClickPos(e : MouseEvent) : { x : number; y : number } {
    const x = e.clientX;
    const y = e.clientY;

    return {
        x , 
        y
    }
}



export function createErrorFileName(e : ErrorEvent) {
    const baseFileName = e.filename;
    const colNumber = e.colno;
    const lineNumber = e.lineno;

    return `${baseFileName}:${lineNumber}-${colNumber}`;
}


export function makeLeanKeyboardEvent(e : KeyboardEvent , wasLong : number | boolean) : IRaftaKeyboardEvent {
    return {
        ...(e.shiftKey && { shift : true }),
        ...(e.altKey && { alt : true }),
        ...(e.ctrlKey && { ctrl : true }),
        ...(typeof wasLong === 'number' && { wasLong : wasLong }),
        ...(e.target && { target : findDOMPath((e.target as HTMLElement)) }),
        char : e.code,
    }
}
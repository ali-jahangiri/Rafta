import { nanoid } from "nanoid";
import { IRaftaKeyboardEvent } from "../Event/KeyboardEvent";
import appContext from "../AppContext";
import { TEventStore, TEventListKey, TPossibleEmptyEventStore } from "../interfaces/eventStoreInterface";

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

export function clientChecker() : boolean {
    if(typeof window !== "undefined" && typeof document !== "undefined") {
        return true
    }else return false;
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
    })(element as HTMLElement).reverse().join(" ");
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

export function axisProgressCalculator(lastSettledAxisPoint : number , safeAreaSize : number , incomingPosition : number) {
    return (lastSettledAxisPoint + (safeAreaSize / 2)) - (incomingPosition);
}

export function detectAxisOutOfSafArea(calculatedAxisProgress : number , safeAreaSize : number) {
    return calculatedAxisProgress >= safeAreaSize || calculatedAxisProgress < 0;
}


// session helpers
const COUNT_OF_SESSION_ID_PART = 8;
const HALF_OF_SESSION_ID_PART_NUMBER = COUNT_OF_SESSION_ID_PART / 2;

export function generateSessionId(time ?: number) : string {
    const currentTime = time || Date.now();
    const id = nanoid(COUNT_OF_SESSION_ID_PART);
    return `${id.slice(0 , HALF_OF_SESSION_ID_PART_NUMBER)}${currentTime}${id.slice(HALF_OF_SESSION_ID_PART_NUMBER)}`;
}

export function extractTimeFromSession(session : string) : number {
    return Number(session.slice(HALF_OF_SESSION_ID_PART_NUMBER , -HALF_OF_SESSION_ID_PART_NUMBER));
}

export function extractIdFromSession(session : string) {
    return `${session.slice(0 , HALF_OF_SESSION_ID_PART_NUMBER)}${session.slice(session.length - HALF_OF_SESSION_ID_PART_NUMBER)}`;
}

export function validateSessionSchema(session : string | null) : boolean {
    if(session) {
        const sessionTime = session.slice(HALF_OF_SESSION_ID_PART_NUMBER , -HALF_OF_SESSION_ID_PART_NUMBER);
        const haveValidSessionIdLength = (session.length - sessionTime.length) === COUNT_OF_SESSION_ID_PART;
        const haveInvalidTimestamp = isNaN(Number(sessionTime));
        
        if(haveValidSessionIdLength && !haveInvalidTimestamp) return true;
        else return false;  
    }else return false;
}

export function updateSessionTime(session : string) {
    const currentTime = Date.now();
    const id = extractIdFromSession(session);

    return `${id.slice(0 , HALF_OF_SESSION_ID_PART_NUMBER)}${currentTime}${id.slice(HALF_OF_SESSION_ID_PART_NUMBER)}`;
}

export function sessionInContext() {
    return {
        set(session : string) {
            appContext.getContext().sessionId = session;
        },
        get() {
            return appContext.getContext().sessionId;
        }
    }
}


export function generateEmptyEventStoreList() : TEventStore {
    return {
        clicks : [],
        types : [],
        scrolls : [],
        mouseMoves : [],
        resizes : [],
        focuses : [],
        errors : [],
        visibilityChanges : [],
        zooms : [],
    }
}

export function clearEmptyEventsList(eventStore : TEventStore) {
    const newBaseObject : TPossibleEmptyEventStore = {};
    Object.entries(eventStore)
        .filter(([_ , value]) => value.length)
        .map(([key , value]) => newBaseObject[(key as TEventListKey)] = value);
    return newBaseObject;
}

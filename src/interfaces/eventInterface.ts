export interface IRaftaEventModule {
    attachEventToWindow : () => void;
    terminateEvent : () => void;
}
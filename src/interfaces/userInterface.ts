export interface IBrowserDetailsMethod {
    version : number | string;
    name : string;
}

export interface IUserLocationFailed {
    code : number;
    message : string;
}

export interface IUserLocation {
    location : {
        latitude : number;
        longitude : number;
    } | "User denied Geolocation";
    timestamp : number;
}

export interface IUserViewportMethod {
    width : number;
    height : number;
}

export type TUserDevice = "phone" | "desktop" | "unknown";

export interface IUserEntireData {
    browser : {
        path : string;
        details : IBrowserDetailsMethod;
        viewport : IUserViewportMethod;
        cookie : boolean;
    },
    user : {
        device : TUserDevice;
        osName : string;
    }
}
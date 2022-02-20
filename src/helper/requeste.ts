import { generateId } from ".";
import { IUserEntireData } from "../interfaces/UserInterface";
import developmentRef from "../server/reference/DevelopmentReference";

export function initialize(data : IUserEntireData) {
    const now = new Date();
    const sessionId = `${generateId()}${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

    developmentRef.add({
        sessionId,
        data,
    })
}



export function sendEvent() {

}

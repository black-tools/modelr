import {Pool, Store} from "../..";

export class WebPool implements Pool{

    constructor(){

    }

    updateOnlineStatus(msg) {
        var status = document.getElementById("status");
        var condition = navigator.onLine ? "ONLINE" : "OFFLINE";
        status.setAttribute("class", condition);
        var state = document.getElementById("state");
        state.innerHTML = condition;
        var log = document.getElementById("log");
        log.appendChild(document.createTextNode("Event: " + msg + "; status=" + condition + "\n"));
    }

    loaded() {
        this.updateOnlineStatus("load");
        document.body.addEventListener("offline",  () => {
            this.updateOnlineStatus("offline")
        }, false);
        document.body.addEventListener("online",  () => {
            this.updateOnlineStatus("online")
        }, false);
    }

    getStore<T>(entityConstructor: { new(...args): T }): Store<T> {
        return undefined;
    }

}
import {Pool, Store} from "../../";
import {SocketStore} from "./socket.store";

export class SocketPool implements Pool {

    private requestId: number = 0;
    private pendingRequests = {};

    constructor(private socket) {
        socket.on('R', (data) => {
            const rId = data[0];
            const code = data[1];
            const result = data[2];
            if (rId in this.pendingRequests) {
                if (code == 200) {
                    this.pendingRequests[rId][0](result);
                } else {
                    this.pendingRequests[rId][1](result);
                }
                delete this.pendingRequests[rId];
            }
        });
    }

    public send(method, path, params, data?) : Promise<any | any[]>{
        return new Promise((resolve, reject) => {
            this.pendingRequests[++this.requestId] = [resolve, reject];

            const event = method + ' ' + path;
            console.dir(event, this.requestId, params, data);

            this.socket.emit(event, [this.requestId, params, data]);
        })
    }

    getStore<T>(entityConstructor: { new(...args): T }): Store<T> {
        return new SocketStore<T>(entityConstructor, this);
    }

}
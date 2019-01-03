import {Pool, Store} from "../../";
import {SocketStore} from "./socket.store";

export class SocketPool implements Pool {

    private requestId: number = 0;
    private pendingRequests: {};

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

    private send(method, path, params, data) {
        return new Promise((resolve, reject) => {
            this.pendingRequests[++this.requestId] = [resolve, reject];
            this.socket.emit(method + ' ' + path, [params, data]);
        })
    }

    getStore<T>(entityConstructor: { new(...args): T }): Store<T> {
        return new SocketStore<T>(entityConstructor, this.socket);
    }

}
import {Pool, Store} from "../../";
import {RestStore} from "./rest.store";

export class RestPool implements Pool {

    constructor(private url: string) {

    }

    getUrl() {
        return this.url;
    }

    getStore<T>(entityConstructor: { new(...args): T }): Store<T> {
        return new RestStore<T>(entityConstructor, this.url);
    }

}
import {Store} from "./store";

export interface Pool {
    getStore<T>(entityConstructor: { new(...args): T; }): Store<T>;
}
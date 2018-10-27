import {Pool, Store} from "../../";
import {LocalStore} from "./local.store";


function openIndexDB(request, upgrader) {
    return new Promise((resolve, reject) => {
        let db;
        request.addEventListener('error', (event) => {
            reject(event);
        });

        request.addEventListener('upgradeneeded', (event) => {
            db = request.result;
            upgrader(db);
        });

        request.addEventListener('success', (event) => {
            resolve(db);
        });
    })
}


export class LocalPool implements Pool {

    db;
    stores: LocalStore<any>[] = [];

    constructor(private name: string) {
    }

    public async connect() {
        await openIndexDB(indexedDB.open(this.name, (new Date()).getTime()), (db) => {
            this.db = db;
            this.sync();
        });
    }

    getStore<T>(entityConstructor: { new(...args): T }): Store<T> {
        const store = new LocalStore<T>(entityConstructor);
        this.stores.push(store);
        return store;
    }

    private sync() {
        this.stores.forEach((store) => {
            this.createObjectStore(store);
            store.setIDB(this.db);
        });
    }

    private createObjectStore(store) {
        try {
            this.db.deleteObjectStore(store.name);
        } catch (err) {

        }
        const idbStore = this.db.createObjectStore(store.name, {keyPath: 'id'});
        // idbStore.createIndex("id", "id", {unique: true});
        return idbStore;
    }
}
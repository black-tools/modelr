import {Mapper} from "../../mapper";
import {Store} from "../../";


function satisfies(elem, iter){
    for(const key in iter){
        if(elem[key] !== iter[key]){
            return false;
        }
    }
    return true;
}


export class LocalStore<T> implements Store<T> {

    mapper: Mapper<T>;
    name: string;
    db: any;

    constructor(private entityConstructor: { new(...args): T; }) {
        this.mapper = new Mapper<T>(entityConstructor);
        this.name = (<any>entityConstructor).options.name;
    }

    private findInStore(params): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const data = [];
            const tx = this.db.transaction(this.name, "readonly");
            const index = tx.objectStore(this.name)
            index.openCursor().onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    const elem = cursor.value;
                    if(satisfies(elem, params)){
                        data.push(cursor.value);
                    }
                    cursor.continue();
                } else {
                    resolve(data);
                }
            }
        })
    }





    async find(params, options?) {
        const results = await this.findAll(params);
        return results.length > 0 ? results[0] : null;
    }

    async findAll(params) {
        const data = await this.findInStore(params);
        return data.map(e => this.mapper.map(e));
    }

    async save(entities: T | T[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const isArray = Array.isArray(entities);
            const data = (isArray ? entities : [entities]) as T[];
            const tx = this.db.transaction(this.name, "readwrite");
            const added = [];
            tx.oncomplete = (ev) => {
                resolve(isArray ? added : added[0]);
            };

            tx.onerror = (event) => {
                reject(event.target);
            };


            data.forEach((entity: any) => {
                let r = Math.random().toString(36).substring(7);
                entity.id = entity.id || r;
                tx.objectStore(this.name).put(entity);
                added.push(entity);
            });


        }) as Promise<T[]>;
    }

    async saveAll(data) {
        return this.save(data);
    }

    setIDB(db) {
        this.db = db;
    }
}

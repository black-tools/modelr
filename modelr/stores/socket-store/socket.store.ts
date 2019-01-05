import * as pluralize from 'pluralize';
import {Mapper} from "../../mapper";
import {Store} from "../../";
import {SocketPool} from "./socket.pool";

export class SocketStore<T> implements Store<T> {

    name: string;
    mapper: Mapper<T>;


    constructor(private entityConstructor: { new(...args): T; }, private pool: SocketPool) {
        this.mapper = new Mapper<T>(entityConstructor);
        let name = (<any>entityConstructor).options.name;
        this.name = pluralize(name);
    }


    async find(params, options?) {
        let results = await this.pool.send('query', name, params);
        if (results) {
            return this.mapper.map(results);
        } else {
            return null;
        }
    }

    async findAll(params) {
        const res = await this.pool.send('get', name, params);
        return res ? res.map(e => this.mapper.map(e)) : null;
    }

    async save(entities: T | T[]) {
        const res = await this.pool.send('save', name, entities);
        return this.mapper.map(res);
    }

    async saveAll(entities) {
        const res = await this.pool.send('saveall', name, entities);
        return this.mapper.mapAll(res as any);
    }

    async remove(params) {
        const results = await this.pool.send('remove', name, params);
        if (results) {
            return this.mapper.map(results);
        } else {
            return null;
        }
    }
}

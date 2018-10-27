import axios from "axios";
import * as pluralize from 'pluralize';
import {Mapper} from "../../mapper";
import {Store} from "../../";

export class RestStore<T> implements Store<T> {


    url: string;
    mapper: Mapper<T>;

    constructor(private entityConstructor: { new(...args): T; }, poolUrl: string) {
        this.mapper = new Mapper<T>(entityConstructor);
        let name = (<any>entityConstructor).options.name;
        this.url = poolUrl + '/' + pluralize(name);
    }

    async find(params, options? ) {
        let results = await axios.get(this.url, {
            params: params
        });
        if (results.data.length > 0) {
            return this.mapper.map(results.data[0]);
        } else {
            return null;
        }
    }

    async findAll(params) {
        let res = await axios.get(this.url, {
            params: params
        });
        return res ? res.data.map(e => this.mapper.map(e)) : null;
    }

    async save(entities: T | T[]) {
        if (entities instanceof Array) {
            let res = await axios.put(this.url + '/', entities);
            return this.mapper.mapAll(res.data);
        } else {
            let res;
            if ((entities as any).id) {
                res = await axios.put(this.url + '/' + (entities as any).id, entities);
            } else {
                res = await axios.put(this.url, entities);
            }
            return this.mapper.map(res.data);
        }
    }

    async saveAll(data) {
        return this.save(data);
    }
}

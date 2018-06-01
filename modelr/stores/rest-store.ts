import axios from "axios";
import * as pluralize from 'pluralize';
import {IEntityAttributes} from "../entity";
import {Mapper} from "../mapper";

export class RestStore<T> {

    url: string;
    mapper: Mapper<T>;

    constructor(private entityConstructor: {new(...args): T; }) {
        this.mapper = new Mapper<T>(entityConstructor);
        let name = (<any>entityConstructor).options.name;
        let remoteUrl = (<any>entityConstructor).options.remoteUrl;
        this.url = remoteUrl + '/' + pluralize(name);
    }

    async find(params) {
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
                res = await axios.post(this.url, entities);
            }
            return this.mapper.map(res.data);
        }
    }

}

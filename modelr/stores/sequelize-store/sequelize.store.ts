// import axios from "axios";
// import * as pluralize from 'pluralize';
import * as Sequelize from 'sequelize';
import {Mapper} from "../../mapper";
import {Store} from "../../interfaces/store";


export class SequelizeStore<T> implements Store<T> {


    mapper: Mapper<T>;
    sqlModel: any;

    constructor(private entityConstructor: { new(...args): T; }, sequelize: any) {
        this.mapper = new Mapper<T>(entityConstructor);

        let name = (<any>entityConstructor).options.name;


        const attrs = (<any>entityConstructor).schema.attributes;


        let sqlSchema = {};
        console.log(attrs);

        for (let a in attrs) {
            sqlSchema[a] = this.schemaConversion(attrs[a]);
        }

        this.sqlModel = sequelize.define(name, sqlSchema);


        let remoteUrl = (<any>entityConstructor).options.remoteUrl;
        // this.url = remoteUrl + '/' + pluralize(name);
    }


    private schemaConversion(attribute: any) {

        let sqlType = attribute.type instanceof String ? Sequelize.STRING : Sequelize.TEXT;

        // console.log(attribute);
        return {
            type: sqlType
        }
    }


    async find(params) {
        return this.sqlModel.findOne({params});
        // let results = await axios.get(this.url, {
        //     params: params
        // });
        // if (results.data.length > 0) {
        //     return this.mapper.map(results.data[0]);
        // } else {
        //     return null;
        // }
    }

    async findAll(params) {
        return this.sqlModel.findAll({params});
        // let res = await axios.get(this.url, {
        //     params: params
        // });
        // return res ? res.data.map(e => this.mapper.map(e)) : null;
    }

    async save(entities: T | T[]) {

        // if (entities instanceof Array) {
        //     let res = await axios.put(this.url + '/', entities);
        //     return this.mapper.mapAll(res.data);
        // } else {
        //     let res;
        //     if ((entities as any).id) {
        //         res = await axios.put(this.url + '/' + (entities as any).id, entities);
        //     } else {
        //         res = await axios.post(this.url, entities);
        //     }
        //     return this.mapper.map(res.data);
        // }
    }

    saveAll(entities): Promise<T[]> {
        return this.sqlModel.deepUpsert(entities);
    }

    sync(options) {
        return this.sqlModel.sync(options);
    }


}

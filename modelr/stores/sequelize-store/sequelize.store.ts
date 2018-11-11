// import axios from "axios";
// import * as pluralize from 'pluralize';
import * as Sequelize from 'sequelize';
import {Mapper} from "../../mapper";
import {Store} from "../../interfaces/store";


export class SequelizeStore<T> implements Store<T> {


    mapper: Mapper<T>;
    public sqlModel: any;
    schema: any;

    constructor(private entityConstructor: { new(...args): T; }, sequelize: any) {
        this.mapper = new Mapper<T>(entityConstructor);
        this.schema = (<any>entityConstructor).schema;

        let name = (<any>entityConstructor).options.name;


        // console.log((<any>entityConstructor).schema);
        const attributes = this.schema.attributes;


        let sqlSchema = {};

        for (let a in attributes) {
            sqlSchema[a] = this.schemaConversion(attributes[a]);
        }

        this.sqlModel = sequelize.define(name, sqlSchema);


        // console.log('associations -> ', associations);


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

    genIncludes(fields) {
        const includes = [];
        for (let key of fields) {
            if (key in this.schema.associations) {
                const association = this.schema.associations[key];
                includes.push({model: association.type.restStore.sqlModel, as: key});
            }
        }
        return includes;
    }


    async find(params, options?) {
        // console.log('includes', options.fields, this.genIncludes((options && options.fields) || {}))
        const result = await this.sqlModel.findOne({
            where: params,
            include: this.genIncludes((options && options.fields) || {})
        });

        if (result) {
            return this.mapper.map(result.get({plain: true}));
        } else {
            return null;
        }
        // let results = await axios.get(this.url, {
        //     params: params
        // });
        // if (results.data.length > 0) {
        //     return this.mapper.map(results.data[0]);
        // } else {
        //     return null;
        // }
    }

    async findAll(params, options?) {
        const results = await this.sqlModel.findAll({
            where: params,
            include: this.genIncludes((options && options.fields) || {})
        });
        return this.mapper.mapAll(results.map(r => r.get({plain: true})));

        // let res = await axios.get(this.url, {
        //     params: params
        // });
        // return res ? res.data.map(e => this.mapper.map(e)) : null;
    }

    async save(entities: T | T[]) {
        return this.sqlModel.deepUpsert(entities);

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

    associate() {
        const associations = this.schema.associations;
        for (let a in associations) {
            const type = associations[a].type;
            if(associations[a].multiple){
                this.sqlModel.hasMany(type.store.sqlModel, {as: a});
            }else {
                this.sqlModel.belongsTo(type.store.sqlModel, {as: a});
            }
        }
    }

    sync(options) {
        return this.sqlModel.sync(options);
    }


}

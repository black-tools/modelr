// import axios from "axios";
// import * as pluralize from 'pluralize';
import * as Sequelize from 'sequelize';
import {Mapper} from "../../mapper";
import {Store} from "../../interfaces/store";
import {validateWhere} from "./sequelize-conditionals";

export class SequelizeStore<T> implements Store<T> {


    mapper: Mapper<T>;
    public sqlModel: any;
    schema: any;

    constructor(private entityConstructor: { new(...args): T; }, sequelize: any) {
        this.mapper = new Mapper<T>(entityConstructor);
        this.schema = (<any>entityConstructor).schema;

        let name = (<any>entityConstructor).options.name;


        const attributes = this.schema.attributes;


        let sqlSchema = {};

        for (let a in attributes) {
            sqlSchema[a] = this.schemaConversion(attributes[a]);
        }

        this.sqlModel = sequelize.define(name, sqlSchema);
    }


    private schemaConversion(attribute: any) {
        let sqlType;
        if (attribute.type === String) {
            const numericType = attribute.typeDomain || 'text';
            sqlType = Sequelize[numericType.toLocaleUpperCase()];
        } else if (attribute.type === Date) {
            sqlType = Sequelize.DATE;
        } else if (attribute.type === Number) {
            const numericType = attribute.typeDomain || 'double';
            sqlType = Sequelize[numericType.toLocaleUpperCase()];
        }

        return {
            type: sqlType
        }
    }

    genIncludes(fields) {
        const includes = [];
        for (let key of fields) {
            if (key in this.schema.associations) {
                const association = this.schema.associations[key];
                includes.push({model: association.type.store.sqlModel, as: key, through: association.through});
            }
        }
        return includes;
    }


    async find(params, options?) {
        const result = await this.sqlModel.findOne({
            where: validateWhere(params),
            include: this.genIncludes((options && options.fields) || {})
        });

        if (result) {
            return this.mapper.map(result.get({plain: true}));
        } else {
            return null;
        }
    }

    async findAll(params, options?) {
        const results = await this.sqlModel.findAll({
            where: validateWhere(params),
            include: this.genIncludes((options && options.fields) || {}),
            order: (options && options.order) || null,
            limit: (options && options.limit) || null,
            offset: (options && options.offset) || null
        });
        return this.mapper.mapAll(results.map(r => r.get({plain: true})));
    }

    async save(entity: T) {
        const result = await this.sqlModel.deepUpsert(entity);
        return result.get({plain: true});
    }

    async saveAll(entities): Promise<T[]> {
        const results = await this.sqlModel.deepUpsert(entities);
        return this.mapper.mapAll(results.map(r => r.get({plain: true})));
    }

    associate() {
        const associations = this.schema.associations;
        for (let a in associations) {
            const type = associations[a].type;
            if (associations[a].multiple && associations[a].through) {
                this.sqlModel.belongsToMany(type.store.sqlModel, {as: a, through: associations[a].through});
            } else if (associations[a].multiple) {
                this.sqlModel.hasMany(type.store.sqlModel, {as: a});
            } else {
                this.sqlModel.belongsTo(type.store.sqlModel, {as: a});
            }
        }
    }

    sync(options) {
        return this.sqlModel.sync(options);
    }


}

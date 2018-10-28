import {find, findIndex, cloneDeep} from 'lodash';
import {Mapper} from "./mapper";
import {Collection} from "./collection";


export const IEntity = <T>() => class extends IEntityAttributes {

    static create: (entity: Partial<T>) => T;

    // simplificando. depois isto é para ser td complexo com wheres e tal.
    static find: (id: number | { [param: string]: any }, options?: { [param: string]: any }) => Promise<T>;
    static findAll: (params: { [param: string]: any }) => Promise<T[]>;
    static saveAll: (entities: T | T[]) => Promise<T[]>;


    clone: () => T;
    save: () => Promise<T>;
    remove: () => Promise<T>;
};


export const Entity = function (options) {
    return <T extends IEntityAttributes>(constructor: any) => {
        constructor.options = options;
        constructor.schema = {
            ...{
                attributes: {},
                associations: {}
            },
            ...(constructor.schema || {}),
        };

        constructor.mapper =  new Mapper<T>(constructor);
        constructor.store =  options.pool.getStore(constructor);

        constructor.schema.attributes.id = Number;


        constructor.create = function (entity) {
            return constructor.mapper.map(entity);
        };

        constructor.find = async function (params, options) {
            return await constructor.store.find(params, options);
        };

        constructor.findAll = async function (params) {
            return await constructor.store.findAll(params);
        };

        constructor.saveAll = async function (entities) {
            return await constructor.store.saveAll(entities);
        };

        Object.defineProperty(constructor, 'Collection', {
            get() {
                return new Collection(constructor.store);
            }
        });

        constructor.prototype.save = async function () {
            return await constructor.store.save(this);
        };

        constructor.prototype.clone = function () {
            return this.mapper.map(this);
        }


    }
};

export class IEntityAttributes {
    id: number;
}



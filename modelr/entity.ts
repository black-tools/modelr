import {find, findIndex, cloneDeep} from 'lodash';
import {Mapper} from "./mapper";


export const IEntity = <T>() => class implements IEntityAttributes {
    id: number;

    static create: (entity: Partial<T>) => T;
    static find: (id: number | { [param: string]: any }) => Promise<T>; // simplificando. depois isto é para ser td complexo com wheres e tal.
    static findAll: (params: { [param: string]: any }) => Promise<T[]>;
    static saveAll: (entities: T | T[]) => Promise<T[]>;

    clone: () => T;
    save: () => Promise<T>;
    remove: () => Promise<T>;
};


export const Entity = function (options) {
    return <T extends IEntityAttributes>(constructor: any) => {

        constructor.options = options;
        constructor.mapper = new Mapper<T>(constructor);
        constructor.restStore = options.pool.getStore(constructor);

        constructor.schema = {
            ...{
                attributes: {}
            },
            ...(constructor.schema || {}),
        };
        constructor.schema.attributes.id = Number;


        constructor.create = function (entity) {
            return constructor.mapper.map(entity);
        };

        constructor.find = async function (params) {
            return await constructor.restStore.find(params);
        };

        constructor.findAll = async function (params) {
            return await constructor.restStore.findAll(params);
        };

        constructor.saveAll = async function (entities) {
            return await constructor.restStore.saveAll(entities);
        };

        constructor.prototype.save = async function () {
            return await constructor.restStore.save(this);
        };

        constructor.prototype.save = async function () {
            return await constructor.restStore.save(this);
        };

        constructor.prototype.clone = function () {
            return this.mapper.map(this);
        }

    }
};

export interface IEntityAttributes {
    id: number;
}



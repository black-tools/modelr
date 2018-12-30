import {Mapper} from "./mapper";

export function IEntity<T>() {
    return class {
        public id: number = undefined;

        public static create(entity: Partial<T>): T {
            return null;
        };

        public static find(id: number | { [param: string]: any }, options?: { [param: string]: any }): Promise<T> {
            return null;
        }

        public static findAll(params?: { [param: string]: any }, options?: { [param: string]: any }): Promise<T[]> {
            return null;
        }

        public static save(entities: T | T[]): Promise<T[]> {
            return null;
        }

        public clone: () => T;
        public save: () => Promise<T>;
        public remove: () => Promise<T>;
    };
}


export function Entity(options) {
    return <T extends { new(...args: any[]): {} }>(constructor: any) => {
        constructor.__is__entity__ = true;
        constructor.options = options;
        constructor.schema = {
            ...{
                attributes: {},
                associations: {}
            },
            ...(constructor.schema || {}),
        };

        constructor.mapper = new Mapper<T>(constructor);
        constructor.store = options.pool.getStore(constructor);

        constructor.schema.attributes.id = Number;


        constructor.create = function (entity) {
            return constructor.mapper.map(entity);
        };

        constructor.find = async function (params, options) {
            return await constructor.store.find(params, options);
        };

        constructor.findAll = async function (params, options) {
            return await constructor.store.findAll(params, options);
        };

        constructor.save = async function (entities) {
            if (Array.isArray(entities)) {
                return await constructor.store.saveAll(entities);
            } else {
                return await constructor.store.save(entities);
            }
        };



        constructor.prototype.save = async function () {
            return await constructor.store.save(this);
        };

        constructor.prototype.remove = async function () {
            return await constructor.store.remove(this);
        };

        constructor.prototype.clone = function () {
            return this.mapper.map(this);
        };

        return constructor;
    }
}



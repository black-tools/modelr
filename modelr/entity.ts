import {find, findIndex, cloneDeep} from 'lodash';
import {Mapper} from "./mapper";
import {Collection} from "./collection";


export function IEntity<T>() {
    return class {
        id: number;

        public static create(entity: Partial<T>): T {
            return null;
        };

        // simplificando. depois isto é para ser td complexo com wheres e tal.
        public static find(id: number | { [param: string]: any }, options?: { [param: string]: any }): Promise<T> {
            return null;
        }

        public static findAll(params: { [param: string]: any }): Promise<T[]> {
            return null;
        }

        public static saveAll(entities: T | T[]): Promise<T[]> {
            return null;
        }

        public clone: () => T;
        public save: () => Promise<T>;
        public remove: () => Promise<T>;
    };
}


export function Entity(options) {
    return <T extends { IEntity<T>() }>(constructor: any) => {
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



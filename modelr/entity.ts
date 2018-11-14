import {find, findIndex, cloneDeep} from 'lodash';
import {Mapper} from "./mapper";

// import {Collection} from "./collection";


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
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        return class EntityClass extends constructor {
            static __is__entity__ = true;
            static options = options;
            static schema = {
                ...{
                    attributes: {},
                    associations: {}
                },
                ...((constructor as any).schema || {}),
            };
            static mapper = new Mapper<T>(constructor as any);
            static store = options.pool.getStore(constructor);


            static create(entity) {
                return EntityClass.mapper.map(entity);
            };

            static async find(params, options) {
                return await EntityClass.store.find(params, options);
            };

            static async findAll(params, options) {
                return await EntityClass.store.findAll(params, options);
            };

            static async saveAll(entities) {
                return await EntityClass.store.saveAll(entities);
            };

            async save() {
                return await EntityClass.store.save(this);
            };

            clone() {
                return EntityClass.mapper.map(this as any);
            }
        };
    }
}



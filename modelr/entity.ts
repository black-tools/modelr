import {find, findIndex, cloneDeep} from 'lodash';
import {Collection} from "./collection";
import {Attr} from "./decorators/attribute";
import {RestStore} from "./stores/rest-store";
import {Mapper} from "./mapper";

// database stub.
let database: { [modelName: string]: any[] } = {};


export function Entity(options) {
    return <T extends IEntityAttributes>(constructor: any) => {
        // Object.defineProperty(target, symbol, {
        //     enumerable: false,
        //     writable: false,
        //     value: {}
        // });

        // clean this.
        // let modelName = options.name;
        // database[modelName] = [];

        // function $map(obj: any) {
        //     este assign vai ter de ser substituido por um "deep assign" que checka o schema do objeto para saber como instanciar as classes.
        // return Object.assign(new constructor(), obj);
        // }

        constructor.options = options;
        constructor.mapper = new Mapper<T>(constructor);
        constructor.restStore = new RestStore<T>(constructor);

        constructor.create = function (entity) {
            return constructor.mapper.map(entity);
        };

        // constructor.collection = function () {
        //     return new Collection<T>(constructor.restStore);
        // };

        constructor.find = async function (params) {
            return await constructor.restStore.find(params);
        };

        constructor.findAll = async function (params) {
            return await constructor.restStore.findAll(params);
            // let collection = constructor.collection();
            // console.log('collection', collection);
            // collection.push(...entities);
            // return collection;
        };

        constructor.saveAll = async function (entities) {
            return await constructor.restStore.save(entities);
        };

        constructor.prototype.save = async function () {

            return await constructor.restStore.save(this);
            // return resource ? $map(resource) : null;

            // este cloneDeep tem de ser pensado para a BD local,
            // porque provavelmente o que se deve fazer é "partir" o objeto, e guardar cada parte numa "tabela" diferente.
            // e aqui haveria propagação dos dados para todos os que estivessem a fazer "stream" (good bye redux XD).
            // let saved = cloneDeep(this);
            // if ((<any>this).id) {
            //     let i = findIndex(database[modelName], {id: (<any>this).id});
            //     database[modelName][i] = saved;
            // } else {
            //     (<any>saved).id = database[modelName].length + 1;
            //     database[modelName].push(saved);
            // }
            // return Promise.resolve(saved);
        };

        constructor.prototype.save = async function () {

            return await constructor.restStore.save(this);
            // return x;
            // este cloneDeep tem de ser pensado para a BD local,
            // porque provavelmente o que se deve fazer é "partir" o objeto, e guardar cada parte numa "tabela" diferente.
            // e aqui haveria propagação dos dados para todos os que estivessem a fazer "stream" (good bye redux XD).
            // let saved = cloneDeep(this);
            // if ((<any>this).id) {
            //     let i = findIndex(database[modelName], {id: (<any>this).id});
            //     database[modelName][i] = saved;
            // } else {
            //     (<any>saved).id = database[modelName].length + 1;
            //     database[modelName].push(saved);
            // }
            // return Promise.resolve(saved);
        };

        constructor.prototype.clone = function () {
            return this.mapper.map(this);
        }

        // return class extends constructor {

        // hard coded stuff.
        // a ideia é que isto grave numa base de dados local e propage as alterações / vá buscar os dados da bd central via rest.
        // dps temos de adicionar um metodo tipo stream() que usa observables e que é semelhante aos get/query mas que vai refrescando com as alterações no servidor e locais, sockets, etc..


        // async
    }

    // }
}


export interface IEntityAttributes {
    id: number;

}


//extends { new(...args: any[]): {} }>(constructor: T
export const IEntity = <T>() => class implements IEntityAttributes {
    id: number;

    static create: (entity: Partial<T>) => T;
    static find: (id: number | { [param: string]: any }) => Promise<T>; // simplificando. depois isto é para ser td complexo com wheres e tal.
    static findAll: (params: { [param: string]: any }) => Promise<T[]>;
    static saveAll: (entities: T[]) => Promise<T[]>;

    // static collection: () => Collection<T>;

    clone: () => T;
    save: () => Promise<T>;
    remove: () => Promise<T>;
};


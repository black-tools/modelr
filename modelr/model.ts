import {find, findIndex, cloneDeep} from 'lodash';

// database stub.
let database: { [modelName: string]: any[] } = {};

export function Modelr(options) {
    return <T extends { new(...args: any[]): {} }>(constructor: T) => {
        // Object.defineProperty(target, symbol, {
        //     enumerable: false,
        //     writable: false,
        //     value: {}
        // });

        // clean this.
        let modelName = options.name;
        database[modelName] = [];

        function $map(obj: any) { // este assign vai ter de ser substituido por um "deep assign" que checka o schema do objeto para saber como instanciar as classes.
            return Object.assign(new constructor(), obj);
        }


        (<any>constructor).find = function (id: number) {
            let resource = find(database[modelName], {id: id});
            return Promise.resolve($map(resource));
        };

        constructor.prototype.save = function () {
            // este cloneDeep tem de ser pensado para a BD local,
            // porque provavelmente o que se deve fazer é "partir" o objeto, e guardar cada parte numa "tabela" diferente.
            // e aqui haveria propagação dos dados para todos os que estivessem a fazer "stream" (good bye redux XD).
            let saved = cloneDeep(this);
            if ((<any>this).id) {
                let i = findIndex(database[modelName], {id: (<any>this).id});
                database[modelName][i] = saved;
            } else {
                (<any>saved).id = database[modelName].length + 1;
                database[modelName].push(saved);
            }
            return Promise.resolve(saved);
        };

        // return class extends constructor {

        // hard coded stuff.
        // a ideia é que isto grave numa base de dados local e propage as alterações / vá buscar os dados da bd central via rest.
        // dps temos de adicionar um metodo tipo stream() que usa observables e que é semelhante aos get/query mas que vai refrescando com as alterações no servidor e locais, sockets, etc..


        // async
    }

    // }
}

export function Attr() {
    return function (param1, key) {

        // console.log(param1, key);
    }
}

// function BelongsTo() {
//     return function (param1, key) {
//
//         // console.log(param1, key);
//     }
// }
//
// function HasMany() {
//     return function (param1, key) {
//
//         // console.log(param1, key);
//     }
// }

export function IModelr<T>() {
    return class {
        static find: (id: number) => Promise<T>; // simplificando. depois isto é para ser td complexo com wheres e tal.
        static findAll: () => Promise<T>;

        save: () => Promise<T>;
        remove: () => Promise<T>;
    }
}

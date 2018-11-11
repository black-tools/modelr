import * as Sequelize from 'sequelize';

import {SequelizeStore} from "./sequelize.store";
import {extendSequelize} from "./sequelize-extension";
import {Pool, Store} from "../../";

export class SequelizePool implements Pool {

    public sqlConnection: Sequelize;
    stores: SequelizeStore<any>[] = [];

    constructor(database: string, username: string, password: string, otherOptions: any) {
        this.sqlConnection = new Sequelize(database, username, password, otherOptions);
        extendSequelize(this.sqlConnection);
    }

    async sync(options, stores) {
        return (stores || this.stores).reduce(async (ret, store) => {
            await ret;
            return store.sync(options);
        }, Promise.resolve())
    }

    associate() {
        this.stores.forEach(s => s.associate());
    }

    getStore<T>(entityConstructor: { new(...args): T; }): Store<T> {
        const store = new SequelizeStore<T>(entityConstructor, this.sqlConnection);
        this.stores.push(store);
        return store;
    }

    get sqlModels() {
        return this.stores.map(s => s.sqlModel);
    }


}
import * as Sequelize from 'sequelize';

import {SequelizeStore} from "./sequelize.store";
import {extendSequelize} from "./sequelize-extension";
import {Pool, Store} from "../../";

export class SequelizePool implements Pool {

    sqlConnection: Sequelize;
    stores: SequelizeStore<any>[] = [];

    constructor(database: string, username: string, password: string, otherOptions: any) {
        this.sqlConnection = new Sequelize(database, username, password, otherOptions);
        extendSequelize(this.sqlConnection);
    }

    sync(options) {
        return Promise.all(this.stores.map(s => s.sync(options)));
    }

    getStore<T>(entityConstructor: { new(...args): T; }): Store<T> {
        const store = new SequelizeStore<T>(entityConstructor, this.sqlConnection);
        this.stores.push(store);
        return store;
    }
}
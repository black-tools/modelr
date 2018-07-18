import {SequelizePool} from "../modelr/stores/sequelize-store";
import {Entity, Attr, IEntity} from "../modelr";
import {App, NcModule, Controller} from "@black-tools/anchor";
import {Route} from "@black-tools/anchor";

import {urlencoded, json} from 'body-parser';
import * as cors from 'cors';

let sqlPool = new SequelizePool('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

@Entity({
    pool: sqlPool,
    name: 'foo'
})
export class Foo extends IEntity<Foo>() {

    @Attr() name: string;
    @Attr() temperature: 'cold' | 'warm' | 'hot';

    shoutName() {
        return this.name.toUpperCase() + ' !';
    }

}

sqlPool.sync({force: true});


@Controller({
    path: '/foos'
})
export class FooController {

    @Route({
        path: '/',
        method: 'get'
    })
    async query(params) {
        return Foo.findAll({});
    }

    @Route({
        path: '/:id',
        method: 'get'
    })
    async show(params) {
        return await Foo.find({id: params.id});
    }

    @Route({
        path: '/',
        method: 'put'
    })
    async save(params, data) {
        return Foo.saveAll(data);
    }

    @Route({
        path: '/:id',
        method: 'put'
    })
    async update(params, data) {
        return Foo.saveAll(data); //todo should be save
    }

    @Route({
        path: '/:id',
        method: 'delete'

    })
    async remove(params) {
        const foo = await Foo.find({id: params.id});
        return foo.remove();
    }
}

@NcModule({
    middlewares: [
        cors(),
        urlencoded({extended: false}),
        json(),
    ],
    declarations: [
        FooController
    ]
})
export class AppModule {
}


App.bootstrap({port: 3000}, AppModule);

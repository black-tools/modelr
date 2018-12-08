import {SequelizePool} from "../modelr/stores/sequelize-store";
import {Entity, Attr, IEntity, Collection} from "../modelr";

import {App, NcModule, Controller, Route} from "@black-tools/anchor";
import {Angler, DropMode} from "@black-tools/angler";

import {urlencoded, json} from 'body-parser';
import * as cors from 'cors';

let sqlPool = new SequelizePool('postgres', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

@Entity({
    pool: sqlPool,
    name: 'bar'
})
export class Bar extends IEntity<Bar>() {

}

export class BarCollection extends Collection<Bar>(Bar) {
}


@Entity({
    pool: sqlPool,
    name: 'foo'
})
export class Foo extends IEntity<Foo>() {

    @Attr() name: string;
    @Attr() temperature: 'cold' | 'warm' | 'hot';
    @Attr({through: 'users_bars'}) bars: BarCollection;
    @Attr() bar: Bar;

    shoutName() {
        return this.name.toUpperCase() + ' !';
    }

}


@Controller({
    path: '/bars'
})
export class BarController {

    @Route({
        path: '/',
        method: 'get'
    })
    async query(params) {
        return Bar.findAll({});
    }

    @Route({
        path: '/',
        method: 'put'
    })
    async save(params, data) {
        try {
            return await Bar.save(data);
        } catch (err) {
            console.log('err', err);
            return err;
        }
    }
}


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
        try {
            return await Foo.find({id: params.id}, {fields: ['bars']});
        }
        catch (err) {
            return null;
        }
    }

    @Route({
        path: '/',
        method: 'put'
    })
    async save(params, data) {
        try {
            const foo = await Foo.create(data);
            console.log(foo);
            return foo.save();
        } catch (err) {
            console.log('err', err);
            return err;
        }
    }

    @Route({
        path: '/:id',
        method: 'put'
    })
    async update(params, data) {
        try {
            return await Foo.save(data);
        } catch (err) {
            console.log('err', err);
            return err;

        }
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
        FooController,
        BarController
    ]
})
export class AppModule {
}


async function init() {
    sqlPool.associate();

    const angler = new Angler(sqlPool.sqlConnection, sqlPool.sqlModels);
    await angler.sync({drop: DropMode.ALL});

    console.log('--- end sync');

    App.bootstrap({port: 3000}, AppModule);
}


init();

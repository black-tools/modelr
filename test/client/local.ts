
import {IEntity, Attr, Entity, RemoteResult, SRemote, Store} from "../../modelr";
import {LocalPool, LocalStore} from "../../modelr/stores/local-store";

const pool = new LocalPool('local-pool-test');

@Entity({
    pool: pool,
    name: 'bar'
})
export class Bar extends IEntity<Bar>() {
}

// export class BarCollection extends CollectionFactory<Bar>(Bar) {
// }


@Entity({
    pool: pool,
    name: 'foo'
})
export class Foo extends IEntity<Foo>() {

    @Attr() name: string;
    @Attr() temperature: 'cold' | 'warm' | 'hot';

    //
    // @Attr() bars: BarCollection;


    shoutName() {
        return this.name.toUpperCase() + ' !';
    }

}


export async function test() {
    await pool.connect();

    // let res1 = await Fns.fn1();
    // console.log(res1);
    //
    // // creating a new object.
    // let foo1 = new Foo();
    // foo1.name = 'Cool Foo';
    let foo1 = Foo.create({name: 'Cool Foo', temperature: 'cold'});  // quick object creation.
    foo1 = await foo1.save();
    console.log('Saved: ', foo1);

    // retrieving from db.
    let foo2 = await Foo.find({id: foo1.id});
    console.log('Retreived: ', foo2);

    foo2.name = 'A new name';
    foo2 = await foo2.save();
    console.log('---> ', foo2);
    console.log('Updated: ', foo1, ' to ', foo2);
    console.log('Shout: ', foo1.shoutName());


    console.log('Searching cold foos');
    let foos = await Foo.findAll({temperature: 'cold'});
    foos.forEach(f => {
        console.log(f.id, f.shoutName());
    });
    console.log(', end cold foos.')

    // Here is where
    let savedFoos = await Foo.saveAll(foos);


    // let barZ = Bar.create({});
    // let barY = Bar.create({});

}

import {IEntity, Attr, Entity, RemoteResult, SRemote, Store} from "../../modelr";
import {RestPool, RestStore} from "../../modelr/stores/rest-store";

const pool = new RestPool('http://localhost:3000');

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


    // @Attr() bar: Bar;
    // @Attr() bars: BarCollection;


    shoutName() {
        return this.name.toUpperCase() + ' !';
    }

}


// export class Fns {
//
//     @SRemote({
//         url: 'http://localhost:3000/posts/1',
//         method: ''
//     })
//     static fn1: RemoteResult<void, Foo>;
// }


export async function test() {


    // let res1 = await Fns.fn1();
    // console.log(res1);

    // creating a new object.
    // let foo1 = new Foo();
    // foo1.name = 'Cool Foo';
    let foo1 = Foo.create({name: 'Cool Foo', temperature: 'cold'});  // quick object creation.
    foo1 = await foo1.save();
    console.log('Saved: ', foo1);


    // // retrieving from db.
    let foo2 = await Foo.find({id: 1}); // get or findOne ? find e findOne, em vez de get e query?
    console.log('Retreived: ', foo2);
    //
    foo2.name = 'A new name';
    foo2 = await foo2.save();
    console.log('---> ', foo2);
    console.log('Updated: ', foo1, ' to ', foo2);
    console.log('Shout: ', foo1.shoutName());
    //
    console.log('Searching cold foos, limit 5');
    let foos = await Foo.findAll({temperature: 'cold', _limit: 5});
    foos.forEach(f => {
        console.log(f.id, f.shoutName());
    });

    // Here is where
    let savedFoos = await Foo.saveAll(foos);
    console.log(savedFoos);


    let fooX = Foo.create({name: 'Cool Foo', temperature: 'cold'});  // quick object creation.
    // fooX.

    let barZ = Bar.create({});
    let barY = Bar.create({});

}

import {IEntity, Attr, Entity} from "../modelr";

@Entity({
    name: 'foo',
    remoteUrl: 'http://localhost:3000'
})
export class Foo extends IEntity<Foo>() {

    @Attr() name: string;
    @Attr() temperature: 'cold' | 'warm' | 'hot';

    // provavelmente vai ser dificil obter referencias para "bar" pelo tipo, para instanciar.
    // mas supostamente o . worst case scenario é preciso ser @BelongsTo(Bar) : Bar;
    // @BelongsTo() bars: Bar;

    shoutName() {
        return this.name.toUpperCase() + ' !';
    }

}

async function test() {

    // creating a new object.
    // let foo1 = new Foo();
    // foo1.name = 'Cool Foo';
    let foo1 = Foo.create({name: 'Cool Foo', temperature: 'cold'});  // quick object creation.
    // foo1 = await foo1.save(); // object saved to database. not saving to avoid db explosion.
    // console.log('Saved: ', foo1);


    // retrieving from db.
    let foo2 = await Foo.find({id: 1}); // get or findOne ? find e findOne, em vez de get e query?
    console.log('Retreived: ', foo2);

    foo2.name = 'A new name';
    foo2 = await foo2.save();
    console.log('Updated: ', foo1, ' to ', foo2);
    console.log('Shout: ', foo1.shoutName());

    console.log('Searching cold foos, limit 5');
    let foos = await Foo.findAll({temperature: 'cold', _limit: 5});
    foos.forEach(f => {
        console.log(f.id, f.shoutName());
    });

    // Here is where
    // let savedFoos = Foo.saveAll(foos);
    // console.log(savedFoos);


}

test()
    .then(() => {
        console.log('=== End test.');
    });

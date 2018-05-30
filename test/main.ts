import {IModelr, Attr, Modelr} from "../modelr";

@Modelr({
    name: 'foo'
})
export class Foo extends IModelr<Foo>() {

    @Attr() private id: number;
    @Attr() name: string;

    // provavelmente vai ser dificil obter referencias para "bar" pelo tipo, para instanciar.
    // mas supostamente o . worst case scenario é preciso ser @BelongsTo(Bar) : Bar;
    // @BelongsTo() bars: Bar;

    shoutName() {
        return this.name.toUpperCase() + ' !';
    }

}

async function test() {

    // creating a new object.
    let foo1 = new Foo();
    foo1.name = 'Cool Foo';
    foo1 = await foo1.save(); // object saved to database.
    console.log('Saved: ', foo1);

    // retrieving from db.
    let foo2 = await Foo.find(1); // get or findOne ? find e findOne, em vez de get e query?
    console.log('Retreived: ', foo2);

    foo2.name = 'A new name';
    foo2 = await foo2.save();
    console.log('Updated: ', foo1, ' to ', foo2);
    console.log('Shout: ', foo1.shoutName());

}

test()
    .then(() => {
        console.log('=== End test.');
    });

/**
 * Here comes the magic.
 * We need to do mapping recursively to instantiate attributes/associations and stuff.
 */
export class Mapper<T> {

    constructor(private entityConstructor: {new(...args): T; }) {

    }

    map(rawEntity: Partial<T>) {
        // let object = Object.create(this.entityConstructor);
        return Object.assign(new this.entityConstructor(), rawEntity);
    }

    mapAll(rawEntities: Partial<T>[]) {
        return rawEntities.map(r => this.map(r));
    }

}
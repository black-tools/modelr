/**
 * Here comes the magic.
 * We need to do mapping recursively to instantiate attributes/associations and stuff.
 */
export class Mapper<T> {

    constructor(private entityConstructor: { new(...args): T; }) {

    }

    map(rawEntity: Partial<T>) {
        // let object = Object.create(this.entityConstructor);
        let schema = (<any>this.entityConstructor).schema;
        let applicableRawEntity: any = {};
        for (let key in rawEntity) {
            if (schema.attributes.hasOwnProperty(key)) {
                if (schema.attributes[key].association) {

                } else {
                    applicableRawEntity[key] = rawEntity[key];
                }
            }
        }

        return Object.assign(new this.entityConstructor(), applicableRawEntity);
    }

    mapAll(rawEntities: Partial<T>[]) {
        return rawEntities.map(r => this.map(r));
    }

}
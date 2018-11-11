/**
 * Here comes the magic.
 * We need to do mapping recursively to instantiate attributes/associations and stuff.
 */
export class Mapper<T> {
    constructor(private entityConstructor: { new(...args): T; }) {

    }
    map(rawEntity: Partial<T>) {

        let schema = (<any>this.entityConstructor).schema;
        let applicableRawEntity: any = {};
        for (let key in rawEntity) {
            const rawValue = rawEntity[key];
            if (schema.attributes.hasOwnProperty(key)) {
                applicableRawEntity[key] = rawValue;
            } else if (schema.associations.hasOwnProperty(key)) {
                const association = schema.associations[key];
                const mapper = association.type.mapper;
                if (association.multiple) {
                    applicableRawEntity[key] = mapper.mapAll(rawValue);
                } else {
                    applicableRawEntity[key] = mapper.map(rawValue);
                }
            }
        }

        return Object.assign(new this.entityConstructor(), applicableRawEntity);
    }

    mapAll(rawEntities: Partial<T>[]) {
        return rawEntities.map(r => this.map(r));
    }

}
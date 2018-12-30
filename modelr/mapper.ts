function isString(str) {
    return typeof str === 'string' || str instanceof String
}

/**
 * Here comes the magic.
 * We need to do mapping recursively to instantiate attributes/associations and stuff.
 */
export class Mapper<T> {
    constructor(private entityConstructor: { new(...args): T; }) {

    }

    map(rawEntity: Partial<T>): T {

        let schema = (<any>this.entityConstructor).schema;
        let applicableRawEntity: any = {};
        let newKey;
        for (let key in rawEntity) {
            const rawValue: any = rawEntity[key];
            if (schema.attributes.hasOwnProperty(key)) {
                const type = schema.attributes[key].type;
                if (type === Date) {
                    applicableRawEntity[key] = isString(rawValue) ? new Date(rawValue as string) : rawValue;
                } else {
                    applicableRawEntity[key] = rawValue;
                }
            } else if (schema.associations.hasOwnProperty(key)) {
                const association = schema.associations[key];
                const mapper = association.type.mapper;
                if (association.multiple) {
                    applicableRawEntity[key] = mapper.mapAll(rawValue);
                } else {
                    applicableRawEntity[key] = mapper.map(rawValue);
                }
            } else if (rawValue != null && key.endsWith('_id') && (newKey = key.slice(0,-3)).length > 0 && schema.associations.hasOwnProperty(newKey)){
                const association = schema.associations[newKey];
                const type = association.type;
                applicableRawEntity[newKey] = type.create({id: rawValue})
            }
        }

        return Object.assign(new this.entityConstructor(), applicableRawEntity);
    }

    mapAll(rawEntities: Partial<T>[]): T[] {
        return rawEntities.map(r => this.map(r));
    }

}
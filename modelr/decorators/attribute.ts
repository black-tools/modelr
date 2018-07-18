export function Attr() {
    return function (target: Object, // The prototype of the class
                     propertyKey: string | symbol) {
        let constructor = target.constructor as any;
        constructor.schema = constructor.schema || {};
        constructor.schema.attributes = constructor.schema.attributes || {};
        constructor.schema.attributes[propertyKey] = true;
    }
}


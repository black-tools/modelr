import 'reflect-metadata';
import {Collection} from "../collection";

export interface AttrOptions {
    type?: string;
}

export function Attr(options?: AttrOptions) {
    return function (target: Object, // The prototype of the class
                     propertyKey: string | symbol) {
        let constructor = target.constructor as any;
        constructor.schema = constructor.schema || {};
        constructor.schema.attributes = constructor.schema.attributes || {};
        constructor.schema.associations = constructor.schema.associations || {};

        const returnType = Reflect.getMetadata("design:type", target, propertyKey);
        if (Collection.isPrototypeOf(returnType)) {
            const elReturnType = returnType.__class__;
            constructor.schema.associations[propertyKey] = {
                type: elReturnType,
                multiple: true
            };
        } else if (returnType.__is__entity__) {
            constructor.schema.associations[propertyKey] = {
                type: returnType,
                multiple: false,
                belongsTo: true
            };
        } else {
            constructor.schema.attributes[propertyKey] = {
                type: returnType,
                typeDomain: options && options.type
            };
        }
    }
}

export function AttI(options?: AttrOptions) {
    return Attr({...options, ...{type: 'integer'}});
}

export function AttF(options?: AttrOptions) {
    return Attr({...options, ...{type: 'float'}});
}

export function AttS(options?: AttrOptions) {
    return Attr({...options, ...{type: 'string'}});
}
import 'reflect-metadata';
import {Collection} from "../collection";

export function Attr() {
    return function (target: Object, // The prototype of the class
                     propertyKey: string | symbol) {
        let constructor = target.constructor as any;
        constructor.schema = constructor.schema || {};
        constructor.schema.attributes = constructor.schema.attributes || {};
        constructor.schema.associations = constructor.schema.associations || {};


        const returnType =  Reflect.getMetadata("design:type", target, propertyKey);

        if(Collection.isPrototypeOf(returnType)){
            const elReturnType = returnType.__class__;
            constructor.schema.associations[propertyKey] = {
                type: elReturnType,
                multiple: true
            };

        }else {
            constructor.schema.attributes[propertyKey] = {
                type: returnType
            };
        }


        // console.log('return', returnType);

        // const obj = Object.create(returnType);
        // console.log('>> ', );

        // console.log('1. ', propertyKey, returnType);
        // console.log('1. ', propertyKey, Reflect.getMetadata("design:returntype", target, propertyKey));


    }
}


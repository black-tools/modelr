import 'reflect-metadata';
import axios from "axios";

const decorator = (applyStatic: boolean) =>
    (config: any) =>
        (target: Object, propertyKey: string | symbol) => {

            // console.log('1. ', Reflect.getMetadata("design:type", target, propertyKey));
            // console.log('1. ', Reflect.getMetadata("design:returntype", target, propertyKey));
            // console.log('1. ', Reflect.getMetadata("design:paramtypes", target, propertyKey));
            // console.log('1. ', Reflect.getMetadata("design:returntype", target, propertyKey));
            // console.log('ttt', t);
            // console.log(`${propertyKey} type: ${t.name}`);
            let obj = applyStatic ? target : target.constructor;
            // console.log(Reflect.getOwnPropertyDescriptor(target.constructor.prototype, propertyKey));
            // console.log(Reflect.getOwnPropertyDescriptor(target, propertyKey));
            //
            // console.log(Reflect.get(target.constructor, propertyKey));
            // console.log(Reflect.get(target, propertyKey));
            // console.dir(target.constructor, propertyKey);
            // console.dir(target);

            obj[propertyKey] = (data: any) => {
                return axios({
                    method: config.method || 'get',
                    url: config.url,
                    data: data
                });

                //
                //     console.log(args);
            }
            // return (args: any) => {
            // }

            // The name of the property) {
            // console.log("MethodDecorator called on: ", target, propertyKey, descriptor);
        };


export function Remote(args) {
    return decorator(false)(args);
}

export function SRemote(args) {
    return decorator(true)(args);
}



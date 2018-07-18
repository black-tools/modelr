import {RestStore} from "./stores/rest-store/rest.store";
import {IEntityAttributes} from "./entity";

export class Collection<T> extends Array<T> {

    constructor(private restStore: RestStore<T>,
                ...items: T[]) {
        super(...items);
    }

    // pushAll(items: Partial<T>[]) {
    //     Array.push.apply(items);
    // }

    saveAll() {
        let resources = this.restStore.save(this)
    }

    // push(...item: Partial<T>[]) {
    //     return 5;
    // }
}
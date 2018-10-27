import {Store} from "./interfaces/store";

export class Collection<T> extends Array<T> {

    constructor(public store: Store<T>) {
        super();
    }

    // pushAll(items: Partial<T>[]) {
    //     Array.push.apply(items);
    // }

    saveAll() {
        // let resources = this.db.save(this)
    }

    // push(...item: Partial<T>[]) {
    //     return 5;
    // }
}

export function CollectionFactory<T>(classType) {
    return class extends Collection<T> {
        public static __class__ = classType;
    }
}
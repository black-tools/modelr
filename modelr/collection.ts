export function Collection<T>(classType) {
    const CollectionClass = class extends Array<T> {
        public static readonly __is_collection__ = true;
        public static readonly __class__ = classType;

        constructor(items?: Array<T>) {
            super(...items);
            Object.setPrototypeOf(this, Object.create(CollectionClass.prototype));
        }

        saveAll() {
            // let resources = this.db.save(this)
        }
    }
    return CollectionClass;
}
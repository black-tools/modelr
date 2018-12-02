export function Collection<T>(classType) {
    return class extends Array<T> {
        public static readonly __is_collection__ = true;
        public static readonly __class__ = classType;

        constructor(public store, ...args: any[]) {
            super(...args);
        }

        saveAll() {
            // let resources = this.db.save(this)
        }
    }
}
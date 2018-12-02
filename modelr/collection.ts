export function Collection<T>(classType) {
    return class {
        public static readonly __is_collection__ = true;
        public static readonly __class__ = classType;

        constructor(public store) {
        }

        saveAll() {
            // let resources = this.db.save(this)
        }
    }
}
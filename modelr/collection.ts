export function Collection<T>(classType) {
    return class extends Array<T> {
        public static readonly __is_collection__ = true;
        public static readonly __class__ = classType;

        saveAll() {
            // let resources = this.db.save(this)
        }
    }
}
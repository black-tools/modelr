export interface Store<T> {
    find(params, options?): Promise<T>;

    findAll(params?, options?): Promise<T[]>;

    saveAll(params?): Promise<T[]>;

    save(entity: T): Promise<T>;

    remove(params?): Promise<T>;
}

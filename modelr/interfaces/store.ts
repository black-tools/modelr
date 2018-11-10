
export interface Store<T> {
    find(params, options?): Promise<T>;

    findAll(params?, options?): Promise<T[]>;
    saveAll(params?): Promise<T[]>;
}

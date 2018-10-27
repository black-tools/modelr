
export interface Store<T> {
    find(params, options?): Promise<T>;

    findAll(params): Promise<T[]>;
    saveAll(params): Promise<T[]>;
}

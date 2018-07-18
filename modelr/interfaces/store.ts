
export interface Store<T> {
    find(params): Promise<T>;

    findAll(params): Promise<T[]>;
    saveAll(params): Promise<T[]>;

    // save(entities: T | T[]): Promise<T | T[]>;
}

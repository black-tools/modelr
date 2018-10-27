export * from './entity'
export * from './collection'
export * from './decorators/attribute'
export * from './decorators/remote'
export * from './interfaces/store'
export * from './interfaces/pool'

export * from './stores/rest-store'
export * from './stores/sequelize-store'

export type RemoteResult<Args, Result> = (args?: Args) => Promise<Result>;

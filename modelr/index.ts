export * from './entity'
export * from './collection'
export * from './decorators/attribute'
export * from './decorators/remote'
export * from './interfaces/store'
export * from './interfaces/pool'

export type RemoteResult<Args, Result> = (args?: Args) => Promise<Result>;

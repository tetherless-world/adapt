export type Object<T> = Record<string, T>

export interface SimpleState<S> {
  get(): S
  set: (value: S) => void
}

export interface GenericObjectState<S extends any> {
  data: Object<S>
  get: (keys: PropertyPath) => S
  set: (keys: PropertyPath, value: S) => void
}

export interface GenericListState<S> extends GenericObjectState<S> {
  data: S[]
  append: (item: S) => void
  remove: (index: number) => void
  clear: () => void
}

export interface PolicyState {
  data: object
  source: SimpleState<string>
  id: SimpleState<string>
  label: SimpleState<string | null>
  definition: SimpleState<string | null>
  action: SimpleState<string | null>
  precedence: SimpleState<string | null>
  effects: GenericListState<any>
  restrictions: {
    request: GenericListState<any>
    requester: GenericListState<any>
  }
}

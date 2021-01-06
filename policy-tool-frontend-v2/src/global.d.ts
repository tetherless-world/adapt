import { PropertyName, PropertyPath } from 'lodash'

export interface SimpleState<S extends any> {
  get: () => S
  set: (value: S) => void
}

export interface GenericMapState<K, V> {
  state: Record<K, V>
  get: (keys: PropertyPath) => V
  set: (keys: PropertyPath, value: V) => void
}

export interface GenericListState<S> extends GenericMapState<number, S> {
  state: S[]
  append: (item: S) => void
  remove: (index: number) => void
  clear: () => void
}

export interface PolicyState {
  data: object
  source: SimpleState<string>
  id: SimpleState<string>
  label: SimpleState<string | undefined>
  definition: SimpleState<string | undefined>
  action: SimpleState<string | null>
  precedence: SimpleState<string | null>
  effects: GenericListState
  requesterRestrictions: GenericListState
  requestRestrictions: GenericListState
}

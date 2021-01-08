import { Draft } from 'immer'
import { Updater } from 'use-immer'
import { PropertyName, PropertyPath } from 'lodash'

export interface SimpleState<S extends any> {
  get: () => S
  set: Updater<S>
}

export interface MapState<K, V> {
  state: Record<K, V>
  get: (keys: PropertyPath) => V
  set: (keys: PropertyPath, value: V) => void
}

export interface ListState<S> extends MapState<number, S> {
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
  effects: ListState<any>
  activityRestrictions: ListState<any>
  agentRestrictions: ListState<any>
}

import { PropertyName, PropertyPath } from 'lodash'
import { MapState, SimpleState } from '../global'

const extractState = <S extends any>(
  state: MapState<any, any>,
  keys: PropertyPath
): SimpleState<S> => {
  const get = () => state.get(keys)
  const set = (value: S) => state.set(keys, value)
  return { get, set }
}

export { extractState }

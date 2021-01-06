import { PropertyName, PropertyPath } from 'lodash'
import { GenericMapState, SimpleState } from '../global'

const extractState = <S extends any>(
  state: GenericMapState<any, any>,
  keys: PropertyPath
): SimpleState<S> => {
  const get = () => state.get(keys)
  const set = (value: S) => state.set(keys, value)
  return { get, set }
}

export { extractState }

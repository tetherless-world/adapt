import { PropertyPath } from 'lodash'
import { GenericObjectState, SimpleState } from '../global'

const extractState = <S>(
  state: GenericObjectState<S>,
  keys: PropertyPath
): SimpleState<S> => {
  const get = () => state.get(keys)
  const set = (value: S) => state.set(keys, value)
  return { get, set }
}

export { extractState }

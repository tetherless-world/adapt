import _, { PropertyName, PropertyPath } from 'lodash'
import { useState } from 'react'
import { MapState } from '../global'

export const useMapState = <K extends PropertyName, V>(
  initialState: Record<K, V>
): MapState<K, V> => {
  const [state, setState] = useState<Record<K, V>>({ ...initialState })

  const get = (keys: PropertyPath) => _.get(state, keys)
  const set = (keys: PropertyPath, value: V) =>
    setState((prev) => ({ ..._.set(prev, keys, value) }))

  return { state, get, set }
}

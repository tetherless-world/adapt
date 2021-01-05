import { useState } from 'react'
import _, { PropertyPath } from 'lodash'
import { GenericListState } from '../global'

const useListState = <T>(initialState: T[] = []): GenericListState<T> => {
  const [data, setState] = useState<T[]>(initialState)
  const append = (item: T) => setState((prev) => [...prev, item])
  const clear = () => setState([])
  const remove = (index: number) =>
    setState((prev) => [...prev.filter((_, i) => i !== index)])
  const update = (keys: PropertyPath, value: T) =>
    setState((prev) => [..._.set(prev, keys, value)])
  const get = (keys: PropertyPath) => _.get(data, keys)
  return { data, append, remove, clear, set: update, get }
}

export { useListState }

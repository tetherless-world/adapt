import { useState } from 'react'
import _, { PropertyPath } from 'lodash'
import { GenericListState } from '../global'

const useListState = <S>(initialState: S[] = []): GenericListState<S> => {
  const [state, setState] = useState<S[]>(initialState)

  const append = (item: S) => setState((prev) => [...prev, item])
  const clear = () => setState([])

  const remove = (index: number) =>
    setState((prev) => [...prev.filter((_, i) => i !== index)])

  const set = (keys: PropertyPath, value: S) =>
    setState((prev) => [..._.set(prev, keys, value)])

  const get = (keys: PropertyPath) => _.get(state, keys)

  return { state, append, remove, clear, set, get }
}

export { useListState }

import { SimpleState } from '../global'
import { useImmer } from 'use-immer'

const useSimpleState = <S>(initialState: S | (() => S)): SimpleState<S> => {
  const [state, setState] = useImmer(initialState)
  return {
    get: () => state,
    set: setState,
  }
}

export { useSimpleState }

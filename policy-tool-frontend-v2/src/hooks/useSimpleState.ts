import { useState } from 'react'
import { SimpleState } from '../global'

const useSimpleState = <S>(initialState: S | (() => S)): SimpleState<S> => {
  const [state, setState] = useState(initialState)
  return {
    get: () => state,
    set: setState,
  }
}

export { useSimpleState }

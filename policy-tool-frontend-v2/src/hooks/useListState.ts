import { Draft } from 'immer'
import { useImmerReducer, Reducer } from 'use-immer'
import _, { PropertyPath } from 'lodash'
import { ListState } from '../global'

enum ActionType {
  PUSH,
  REMOVE,
  CLEAR,
  SET,
  GET,
}

interface PushAction {
  type: ActionType.PUSH
  payload: {
    data: any
  }
}

interface RemoveAction {
  type: ActionType.REMOVE
  payload: {
    index: number
  }
}

interface ClearAction {
  type: ActionType.CLEAR
  payload?: any
}

interface SetAction {
  type: ActionType.SET
  payload: {
    keys: PropertyPath
    data: any
  }
}

export type Action = PushAction | RemoveAction | ClearAction | SetAction

const reducer = (draft: Draft<any[]>, action: Action) => {
  switch (action.type) {
    case ActionType.PUSH:
      return void draft.push(action.payload.data)
    case ActionType.REMOVE:
      return void draft.filter((_, i) => i !== action.payload.index)
    case ActionType.CLEAR:
      return []
    case ActionType.SET:
      return void _.set(draft, action.payload.keys, action.payload.data)
    default:
      return
  }
}

export const useImmerList = (initialState: any): ListState<any> => {
  const [state, dispatch] = useImmerReducer<any>(reducer, initialState)

  const push = (item: any) => dispatch({type: push})
  const clear = () => setState([])

  const remove = (index: number) =>
    setState((prev) => [...prev.filter((_, i) => i !== index)])

  const set = (keys: PropertyPath, value: S) =>
    setState((prev) => [..._.set(prev, keys, value)])

  const get = (keys: PropertyPath) => _.get(state, keys)

  return { state, push, remove, clear, set, get }
}

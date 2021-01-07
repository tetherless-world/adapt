import { createContext } from 'react'
import { ListState } from '../global'

export const RequestRestrictionsContext = createContext<
  ListState<any> | undefined
>(undefined)

export const RequesterRestrictionsContext = createContext<
  ListState<any> | undefined
>(undefined)

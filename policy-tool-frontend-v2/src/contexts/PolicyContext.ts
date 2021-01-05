import { createContext } from 'react'
import { PolicyState } from '../global'

export const PolicyContext = createContext<PolicyState | undefined>(undefined)

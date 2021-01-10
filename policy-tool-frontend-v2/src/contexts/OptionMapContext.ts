import { Dictionary } from 'lodash'
import { createContext } from 'react'

export interface Option {
  value: any
  label: string
}

export type OptionMap = Dictionary<Option[]>

export const OptionMapContext = createContext<OptionMap>({})

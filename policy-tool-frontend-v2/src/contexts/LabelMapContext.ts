import { Dictionary } from 'lodash'
import { createContext } from 'react'

export type LabelMap = Dictionary<string>

export const LabelMapContext = createContext<LabelMap>({})

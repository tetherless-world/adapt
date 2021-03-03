import { createContext } from 'react'

export const SubclassesByURIContext = createContext<Record<string, string[]>>(
  {}
)

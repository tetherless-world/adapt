import { Dictionary, PropertyName, PropertyPath } from 'lodash'

export interface Restriction {
  uri: string
  label: string
  restrictions?: Restriction[]
  values?: Value[]
  subClassOf?: string[]
  unit?: string
  unitLabel?: string
  type?: string
}

export type Option = {
  value: any
  label: string
}

export type Value = {
  value: any
  type: string
}

export type OptionMap = Dictionary<Option[]>

export interface PolicyState {
  id: string
  source: string
  label: string
  definition: string
  action: string
  precedence: string
  agentRestrictions: Restriction[]
  activityRestrictions: Restriction[]
  effects: Value[]
  obligations: Value[]
}

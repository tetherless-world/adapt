import { Dictionary, PropertyName, PropertyPath } from 'lodash'

export interface Restriction {
  uri: string
  label: string
  attributes?: Restriction[]
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

import { AgentRestriction } from './agent'
import {
  BaseAttributeRestriction,
  BaseValueRestriction,
  ClassRestriction,
  MaximalValueRestriction,
  MinimalValueRestriction,
  ValueRestriction,
} from './attribute'
import {
  IntersectionClass,
  Literal,
  NamedNode,
  RestrictionNode,
} from './baseTypes'
import { UnitRestriction } from './unit'
import { ValidityRestriction } from './validity'
import {
  BaseHasValueRestriction,
  HasMaximalValueRestriction,
  HasMinimalValueRestriction,
  HasValueRestriction,
} from './value'

export const isNamedNode = (o: any): o is NamedNode => {
  return '@id' in o && (o['@id'] === null || typeof o['@id'] === 'string')
}

export const isLiteral = (o: any): o is Literal => {
  return (
    '@type' in o &&
    typeof o['type'] === 'string' &&
    '@value' in o &&
    (o['@value'] === null ||
      typeof o['@value'] === 'string' ||
      typeof o['@value'] === 'number')
  )
}

export const isIntersectionClass = (o: any): o is IntersectionClass => {
  return (
    '@type' in o &&
    o['type'] === 'owl:Class' &&
    'owl:intersectionOf' in o &&
    Array.isArray(o['owl:intersectionOf'])
  )
}

export const isRestrictionNode = (o: any): o is RestrictionNode => {
  return '@type' in o && o['@type'] === 'owl:Restriction'
}

export const isAgentRestriction = (
  o: RestrictionNode
): o is AgentRestriction => {
  return o['owl:onProperty'] === 'prov:wasAssociatedWith'
}

export const isValidityRestriction = (
  o: RestrictionNode
): o is ValidityRestriction => {
  return (
    o['owl:onProperty'] === 'prov:endedAtTime' ||
    o['owl:onProperty'] === 'prov:startedAtTime'
  )
}

export const isBaseAttributeRestriction = (
  o: RestrictionNode
): o is BaseAttributeRestriction => {
  return o['owl:onProperty'] === 'sio:hasAttribute'
}

export const isBaseHasValueRestriction = (
  o: RestrictionNode
): o is BaseHasValueRestriction => {
  return o['owl:onProperty'] === 'sio:hasValue'
}

export const isHasValueRestriction = (
  o: BaseHasValueRestriction
): o is HasValueRestriction => {
  return o['owl:hasValue'] !== undefined
}

export const isHasBoundedValueRestriction = (
  o: BaseHasValueRestriction
): o is HasMinimalValueRestriction | HasMaximalValueRestriction => {
  return !isHasValueRestriction(o)
}

export const isHasMinimalValueRestriction = (
  o: HasMinimalValueRestriction | HasMaximalValueRestriction
): o is HasMinimalValueRestriction => {
  let r = o['owl:someValuesFrom']['owl:withRestrictions'][0]
  return 'xsd:minInclusive' in r
}

export const isHasMaximalValueRestriction = (
  o: HasMinimalValueRestriction | HasMaximalValueRestriction
): o is HasMaximalValueRestriction => {
  let r = o['owl:someValuesFrom']['owl:withRestrictions'][0]
  return 'xsd:maxInclusive' in r
}

export const isUnitRestriction = (o: RestrictionNode): o is UnitRestriction => {
  return o['owl:onProperty'] === 'sio:hasUnit'
}

export const isClassRestriction = (
  o: BaseAttributeRestriction
): o is ClassRestriction => {
  if (isIntersectionClass(o['owl:someValuesFrom'])) {
    if (o['owl:someValuesFrom']['owl:intersectionOf'].length == 2) {
      return o['owl:someValuesFrom']['owl:intersectionOf'].every(isNamedNode)
    }
  } else {
    return isNamedNode(o['owl:someValuesFrom'])
  }
  return false
}

export const isBaseValueRestriction = (
  o: BaseAttributeRestriction
): o is BaseValueRestriction => {
  if (isIntersectionClass(o['owl:someValuesFrom'])) {
    let [a, ...rest] = o['owl:someValuesFrom']['owl:intersectionOf']
    if (rest.length === 1) {
      return isBaseHasValueRestriction(rest[0])
    } else if (rest.length === 2) {
      return isBaseHasValueRestriction(rest[0]) && isUnitRestriction(rest[1])
    }
  }
  return false
}

export const isValueRestriction = (
  o: BaseValueRestriction
): o is ValueRestriction => {
  return isHasValueRestriction(o['owl:someValuesFrom']['owl:intersectionOf'][1])
}
export const isBoundedValueRestriction = (
  o: BaseValueRestriction
): o is MinimalValueRestriction | MaximalValueRestriction => {
  return !isValueRestriction(o)
}

export const isMinimalValueRestriction = (
  o: MinimalValueRestriction | MaximalValueRestriction
): o is MinimalValueRestriction => {
  return isHasMinimalValueRestriction(
    o['owl:someValuesFrom']['owl:intersectionOf'][1]
  )
}
export const isMaximalValueRestriction = (
  o: MinimalValueRestriction | MaximalValueRestriction
): o is MaximalValueRestriction => {
  return isHasMaximalValueRestriction(
    o['owl:someValuesFrom']['owl:intersectionOf'][1]
  )
}

import { OWL, SIO } from 'src/namespaces'
import { AgentRestriction } from './agent'
import {
  AttributeRestriction,
  BaseAttributeRestriction,
  BaseValueRestriction,
  BoundedValueRestriction,
  ClassRestriction,
  IntervalRestriction,
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
  HasBoundedValueRestriction,
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
    o['type'] === OWL.Class &&
    OWL.intersectionOf in o &&
    Array.isArray(o[OWL.intersectionOf])
  )
}

export const isRestrictionNode = (o: any): o is RestrictionNode => {
  return '@type' in o && o['@type'] === OWL.Restriction
}

export const isAgentRestriction = (
  o: RestrictionNode
): o is AgentRestriction => {
  return o[OWL.onProperty] === 'prov:wasAssociatedWith'
}

export const isValidityRestriction = (
  o: RestrictionNode
): o is ValidityRestriction => {
  return (
    o[OWL.onProperty] === 'prov:endedAtTime' ||
    o[OWL.onProperty] === 'prov:startedAtTime'
  )
}

export const isBaseAttributeRestriction = (
  o: RestrictionNode
): o is BaseAttributeRestriction => {
  return o[OWL.onProperty] === SIO.hasAttribute
}

export const isBaseHasValueRestriction = (
  o: RestrictionNode
): o is BaseHasValueRestriction => {
  return o[OWL.onProperty] === SIO.hasValue
}

export const isHasValueRestriction = (
  o: BaseHasValueRestriction
): o is HasValueRestriction => {
  return o[OWL.hasValue] !== undefined
}

export const isHasBoundedValueRestriction = (
  o: BaseHasValueRestriction
): o is HasBoundedValueRestriction => {
  return !isHasValueRestriction(o)
}

export const isHasMinimalValueRestriction = (
  o: HasBoundedValueRestriction
): o is HasMinimalValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.withRestrictions][0]
  return 'xsd:minInclusive' in r
}

export const isHasMaximalValueRestriction = (
  o: HasBoundedValueRestriction
): o is HasMaximalValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.withRestrictions][0]
  return 'xsd:maxInclusive' in r
}

export const isUnitRestriction = (o: RestrictionNode): o is UnitRestriction => {
  return o[OWL.onProperty] === SIO.hasUnit
}

export const isClassRestriction = (
  o: BaseAttributeRestriction
): o is ClassRestriction => {
  let o1 = o[OWL.someValuesFrom]
  if (isIntersectionClass(o1)) {
    if (o1[OWL.intersectionOf].length == 2) {
      return o1[OWL.intersectionOf].every(isNamedNode)
    }
  } else {
    return isNamedNode(o[OWL.someValuesFrom])
  }
  return false
}

export const isBaseValueRestriction = (
  o: BaseAttributeRestriction
): o is BaseValueRestriction => {
  let o1 = o[OWL.someValuesFrom]
  if (isIntersectionClass(o1)) {
    let [a, ...rest] = o1[OWL.intersectionOf]
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
  let r = o[OWL.someValuesFrom][OWL.intersectionOf]
  return isHasValueRestriction(r[1])
}

export const isBoundedValueRestriction = (
  o: BaseValueRestriction
): o is BoundedValueRestriction => {
  return !isValueRestriction(o)
}

export const isMinimalValueRestriction = (
  o: BoundedValueRestriction
): o is MinimalValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.intersectionOf]
  return isHasMinimalValueRestriction(r[1])
}
export const isMaximalValueRestriction = (
  o: BoundedValueRestriction
): o is MaximalValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.intersectionOf]
  return isHasMaximalValueRestriction(r[1])
}

export const isAttributeRestriction = (
  o: BaseAttributeRestriction
): o is AttributeRestriction => {
  let o1 = o[OWL.someValuesFrom]
  if (isIntersectionClass(o1)) {
    let [a, ...rest] = o1[OWL.intersectionOf]
    return rest.every((r) => isBaseAttributeRestriction(r))
  }
  return false
}

export const isIntervalRestriction = (
  o: AttributeRestriction
): o is IntervalRestriction => {
  let [a, ...rest] = o[OWL.someValuesFrom][OWL.intersectionOf]
  return (
    rest.every((r) => isBaseValueRestriction(r as BaseAttributeRestriction)) &&
    rest.every((r) => isBoundedValueRestriction(r as BaseValueRestriction)) &&
    isMinimalValueRestriction(rest[0] as BoundedValueRestriction) &&
    isMinimalValueRestriction(rest[1] as BoundedValueRestriction)
  )
}

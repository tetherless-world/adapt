import is from '@sindresorhus/is'
import { OWL, SIO, XSD } from 'src/namespaces'
import { Literal, NamedNode, Node, TypedNode } from '../base'
import { AgentRestriction } from './agent'
import {
  AttributeRestriction,
  BoundedValueRestriction,
  ClassRestriction,
  DisjointValueRestriction,
  IntervalRestriction,
  MaximalValueRestriction,
  MinimalValueRestriction,
  ValueRestriction,
} from './attribute'
import { IntersectionOf, Restriction } from './common'
import {
  DisjointHasValueRestriction,
  HasBoundedValueRestriction,
  HasMaximalValueRestriction,
  HasMinimalValueRestriction,
  HasValueRestriction,
} from './hasValue'
import { UnitRestriction } from './unit'
import { ValidityRestriction } from './validity'

export const isNode = (o: any): o is Node => {
  return is.plainObject(o)
}

export const isTypedNode = (o: Node): o is TypedNode => {
  return !!(o as TypedNode)['@type']
}

export const isNamedNode = (o: Node): o is NamedNode => {
  return is.string((o as NamedNode)['@id'])
}

export const isLiteral = (o: TypedNode): o is Literal => {
  let temp = o as Literal
  return (
    is.null_(temp['@value']) ||
    is.string(temp['@value']) ||
    is.number(temp['@value'])
  )
}

export const isIntersectionOf = (o: TypedNode): o is IntersectionOf => {
  let temp = o as IntersectionOf
  return (
    o['@type'] === OWL.Class &&
    is.array(temp[OWL.intersectionOf]) &&
    temp[OWL.intersectionOf].length >= 2 &&
    temp[OWL.intersectionOf].every(isNode)
  )
}

export const isRestriction = (o: TypedNode): o is Restriction => {
  if (o['@type'] === OWL.Restriction) {
    let temp = o as Restriction
    return (
      isNamedNode(temp[OWL.onProperty]) &&
      (!!temp[OWL.someValuesFrom] || !!temp[OWL.hasValue])
    )
  }
  return false
}

export const isAgentRestriction = (o: Restriction): o is AgentRestriction => {
  return o[OWL.onProperty]['@id'] === 'prov:wasAssociatedWith'
}

export const isValidityRestriction = (
  o: Restriction
): o is ValidityRestriction => {
  return (
    o[OWL.onProperty]['@id'] === 'prov:endedAtTime' ||
    o[OWL.onProperty]['@id'] === 'prov:startedAtTime'
  )
}

export const isDisjointHasValueRestriction = (
  o: Restriction
): o is DisjointHasValueRestriction => {
  return o[OWL.onProperty]['@id'] === SIO.hasValue
}

export const isHasValueRestriction = (
  o: Restriction
): o is HasValueRestriction => {
  return !o[OWL.someValuesFrom] && !!o[OWL.hasValue]
}

export const isHasBoundedValueRestriction = (
  o: DisjointHasValueRestriction
): o is HasBoundedValueRestriction => {
  return !isHasValueRestriction(o)
}

export const isHasMinimalValueRestriction = (
  o: HasBoundedValueRestriction
): o is HasMinimalValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.withRestrictions][0]
  return isLiteral(r[XSD.minInclusive])
}

export const isHasMaximalValueRestriction = (
  o: HasBoundedValueRestriction
): o is HasMaximalValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.withRestrictions][0]
  return isLiteral(r[XSD.maxInclusive])
}

export const isUnitRestriction = (o: Restriction): o is UnitRestriction => {
  return o[OWL.onProperty]['@id'] === SIO.hasUnit
}

export const isClassRestriction = (o: Restriction): o is ClassRestriction => {
  if (
    o['http://www.w3.org/2002/07/owl#onProperty']['@id'] === SIO.hasAttribute
  ) {
    if (
      o['http://www.w3.org/2002/07/owl#someValuesFrom'] &&
      isTypedNode(o['http://www.w3.org/2002/07/owl#someValuesFrom']) &&
      isIntersectionOf(o['http://www.w3.org/2002/07/owl#someValuesFrom'])
    ) {
      return (
        o['http://www.w3.org/2002/07/owl#someValuesFrom'][
          'http://www.w3.org/2002/07/owl#intersectionOf'
        ].length === 2 &&
        o['http://www.w3.org/2002/07/owl#someValuesFrom'][
          'http://www.w3.org/2002/07/owl#intersectionOf'
        ].every(isNamedNode)
      )
    }
    return isNamedNode(o[OWL.someValuesFrom] as NamedNode)
  }
  return false
}

export const isDisjointValueRestriction = (
  o: Restriction
): o is DisjointValueRestriction => {
  if (
    o['http://www.w3.org/2002/07/owl#onProperty']['@id'] === SIO.hasAttribute
  ) {
    if (
      o['http://www.w3.org/2002/07/owl#someValuesFrom'] &&
      isTypedNode(o['http://www.w3.org/2002/07/owl#someValuesFrom']) &&
      isIntersectionOf(o['http://www.w3.org/2002/07/owl#someValuesFrom'])
    ) {
      let [a, b, c] = o['http://www.w3.org/2002/07/owl#someValuesFrom'][
        'http://www.w3.org/2002/07/owl#intersectionOf'
      ]

      return (
        isNamedNode(a) &&
        isDisjointHasValueRestriction(b as Restriction) &&
        (is.undefined(c) || isUnitRestriction(c as Restriction))
      )
    }
  }
  return false
}

export const isValueRestriction = (
  o: DisjointValueRestriction
): o is ValueRestriction => {
  let r = o[OWL.someValuesFrom][OWL.intersectionOf]
  return isHasValueRestriction(r[1])
}

export const isBoundedValueRestriction = (
  o: DisjointValueRestriction
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
  o: Restriction
): o is AttributeRestriction => {
  if (
    o['http://www.w3.org/2002/07/owl#onProperty']['@id'] === SIO.hasAttribute
  ) {
    if (
      o['http://www.w3.org/2002/07/owl#someValuesFrom'] &&
      isTypedNode(o['http://www.w3.org/2002/07/owl#someValuesFrom']) &&
      isIntersectionOf(o['http://www.w3.org/2002/07/owl#someValuesFrom'])
    ) {
      let [a, ...rest] = o['http://www.w3.org/2002/07/owl#someValuesFrom'][
        'http://www.w3.org/2002/07/owl#intersectionOf'
      ]
      return isNamedNode(a) && rest.every((r) => isRestriction(r as TypedNode))
    }
  }
  return false
}

export const isIntervalRestriction = (
  o: AttributeRestriction
): o is IntervalRestriction => {
  let [a, ...rest] = o[OWL.someValuesFrom][OWL.intersectionOf]
  if (rest.length === 2) {
    return (
      rest.every((r) => isDisjointValueRestriction(r as Restriction)) &&
      rest.every((r) =>
        isBoundedValueRestriction(r as DisjointValueRestriction)
      ) &&
      isMinimalValueRestriction(rest[0] as BoundedValueRestriction) &&
      isMaximalValueRestriction(rest[1] as BoundedValueRestriction)
    )
  }
  return false
}

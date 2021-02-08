import { IntersectionClass, NamedNode, RestrictionNode } from './baseTypes'

export interface UnitRestriction extends RestrictionNode {
  'owl:onProperty': 'sio:hasUnit'
  'owl:someValuesFrom':
    | NamedNode
    | (IntersectionClass & { 'owl:intersectionOf': [NamedNode, NamedNode] })
}

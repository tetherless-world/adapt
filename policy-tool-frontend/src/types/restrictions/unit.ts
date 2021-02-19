import { SIO } from 'src/namespaces';
import { IntersectionClass, NamedNode, RestrictionNode } from './baseTypes'

export interface UnitRestriction extends RestrictionNode {
  'owl:onProperty': SIO.hasUnit
  'owl:someValuesFrom':
    | NamedNode
    | (IntersectionClass & { 'owl:intersectionOf': [NamedNode, NamedNode] })
}

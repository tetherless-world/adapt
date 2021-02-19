import { OWL, SIO } from 'src/namespaces';
import { IntersectionClass, NamedNode, RestrictionNode } from './baseTypes'

export interface UnitRestriction extends RestrictionNode {
  [OWL.onProperty]: SIO.hasUnit
  [OWL.someValuesFrom]:
    | NamedNode
    | (IntersectionClass & { [OWL.intersectionOf]: [NamedNode, NamedNode] })
}

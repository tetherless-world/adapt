import { OWL } from 'src/namespaces';
import { NamedNode, RestrictionNode } from './baseTypes'

export interface AgentRestriction extends RestrictionNode {
  [OWL.onProperty]: 'prov:wasAssociatedWith'
  [OWL.someValuesFrom]: NamedNode | RestrictionNode
}

import { NamedNode, RestrictionNode } from './baseTypes'

export interface AgentRestriction extends RestrictionNode {
  'owl:onProperty': 'prov:wasAssociatedWith'
  'owl:someValuesFrom': NamedNode | RestrictionNode
}

import { OWL, PROV } from 'src/namespaces'
import { XOR } from 'ts-xor'
import { NamedNode } from '../base'
import { Restriction } from './common'

export interface AgentRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': PROV.wasAssociatedWith }
  [OWL.someValuesFrom]: XOR<NamedNode, Restriction>
  [OWL.hasValue]: never
}

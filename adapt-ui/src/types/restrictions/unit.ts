import { OWL } from 'src/namespaces'
import { XOR } from 'ts-xor'
import { NamedNode } from '../base'
import { IntersectionOf, Restriction } from './common'

export interface UnitRestriction extends Restriction {
  [OWL.someValuesFrom]: XOR<
    NamedNode,
    IntersectionOf & {
      [OWL.intersectionOf]: [NamedNode, NamedNode]
    }
  >
}

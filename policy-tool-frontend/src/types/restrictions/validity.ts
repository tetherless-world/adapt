import { OWL, PROV, XSD } from 'src/namespaces'
import { XOR } from 'ts-xor'
import { Literal } from '../base'
import { NamedNode } from '../restrictions'
import { DatatypeRestriction, Restriction } from './common'

export interface StartTimeRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': PROV.startedAtTime }
  [OWL.someValuesFrom]: DatatypeRestriction & {
    [OWL.onDatatype]: NamedNode & { '@id': XSD.dateTime }
    [OWL.withRestrictions]: [
      { [XSD.minInclusive]: Literal & { '@type': XSD.dateTime; value: string } }
    ]
  }
}

export interface EndTimeRestriction extends Restriction {
  [OWL.onProperty]: NamedNode & { '@id': PROV.endedAtTime }
  [OWL.someValuesFrom]: DatatypeRestriction & {
    [OWL.onDatatype]: NamedNode & { '@id': XSD.dateTime }
    [OWL.withRestrictions]: [
      { [XSD.maxInclusive]: Literal & { '@type': XSD.dateTime; value: string } }
    ]
  }
}

export type ValidityRestriction = XOR<StartTimeRestriction, EndTimeRestriction>

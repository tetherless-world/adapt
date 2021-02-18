import _ from 'lodash'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { ClassRestriction, isNamedNode } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const ClassRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )

  if (isNamedNode(restriction['owl:someValuesFrom'])) {
    // render as disabled selector
    return <></>
  }

  // render as selector using first named node as label
  return <></>
}

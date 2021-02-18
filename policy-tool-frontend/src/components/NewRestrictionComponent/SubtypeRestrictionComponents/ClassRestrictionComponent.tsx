import _ from 'lodash'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { ClassRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const ClassRestrictionComponentA: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )

  return <></>
}
export const ClassRestrictionComponentB: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )

  return <></>
}

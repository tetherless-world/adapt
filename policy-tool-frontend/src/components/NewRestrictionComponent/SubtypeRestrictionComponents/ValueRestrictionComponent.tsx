import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { ValueRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'
import _ from 'lodash'

export const ValueRestrictionComponentA: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ValueRestriction>((state) =>
    _.get(state, keys)
  )
  return <></>
}

export const ValueRestrictionComponentB: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ValueRestriction>((state) =>
    _.get(state, keys)
  )
  return <></>
}

import _ from 'lodash'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { MaximalValueRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const MaximalValueRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, MaximalValueRestriction>(
    (state) => _.get(state, keys)
  )
  return <></>
}
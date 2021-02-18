import _ from 'lodash'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { MinimalValueRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const MinimalValueRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, MinimalValueRestriction>(
    (state) => _.get(state, keys)
  )

  return <></>
}

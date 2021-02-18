import _ from 'lodash'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { IntervalRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const IntervalRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, IntervalRestriction>((state) =>
    _.get(state, keys)
  )

  // this is probably the most difficult one to do
  // putting off until later
  return <></>
}

import _ from 'lodash'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { ValidityRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const ValidityRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ValidityRestriction>((state) =>
    _.get(state, keys)
  )

  return <></>
}

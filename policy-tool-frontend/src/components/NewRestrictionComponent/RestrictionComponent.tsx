import _ from 'lodash'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { RestrictionNode } from 'src/types/restrictions'
import { getRestrictionComponent } from './getRestrictionComponent'
import { RestrictionProps } from './props'

export const RestrictionComponent: React.FC<RestrictionProps> = ({ keys }) => {
  const restriction = useSelector<PolicyState, RestrictionNode>((state) =>
    _.get(state, keys)
  )

  const RestrictionComponent = useMemo(
    () => getRestrictionComponent(restriction),
    [restriction]
  )

  return !!RestrictionComponent ? <RestrictionComponent keys={keys} /> : <></>
}

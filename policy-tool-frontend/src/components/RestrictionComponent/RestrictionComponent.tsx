import _ from 'lodash'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { Restriction } from 'src/types/restrictions'
import { getRestrictionComponent } from './getRestrictionComponent'
import { RestrictionProps } from './props'

export const RestrictionComponent: React.FC<RestrictionProps> = ({ keys }) => {
  const restriction = useSelector<PolicyState, Restriction>((state) =>
    _.get(state, keys)
  )

  const Component = useMemo(() => getRestrictionComponent(restriction), [
    restriction,
  ])

  return <>{!!Component && <Component keys={keys} />}</>
}

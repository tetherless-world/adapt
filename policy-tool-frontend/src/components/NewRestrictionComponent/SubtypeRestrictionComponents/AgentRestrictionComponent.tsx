import { Grid } from '@material-ui/core'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Selector } from 'src/components/Selector'
import { Option } from 'src/global'
import { OWL } from 'src/namespaces'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import { NamedNode } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const AgentRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, NamedNode>(
    (state) => _.get(state, [...keys, OWL.someValuesFrom]) as NamedNode
  )
  // TODO: retrieve from AgentsContext or some part of the global store.
  let options: Option[] = [{ label: '', value: '' }]
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Selector
          options={options}
          textFieldProps={{
            label: 'Agent',
            onChange: (e) =>
              dispatch(
                actions.update(
                  [...keys, 'owl:someValuesFrom', '@id'],
                  e.target.value
                )
              ),
            value: restriction['@id'],
          }}
        />
      </Grid>
    </Grid>
  )
}

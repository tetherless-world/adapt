import { Grid } from '@material-ui/core'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Selector } from 'src/components/Selector'
import { Option } from 'src/global'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import { AgentRestriction, isNamedNode } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const AgentRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, AgentRestriction>((state) =>
    _.get(state, keys)
  )

  if (!isNamedNode(restriction['owl:someValuesFrom'])) {
    console.error('This should not be printed. Restriction must be invalid.')
    console.error(restriction)
    return <></>
  }

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
              dispatch(actions.update([...keys, '@id'], e.target.value)),
            value: restriction['owl:someValuesFrom']['@id'],
          }}
        />
      </Grid>
    </Grid>
  )
}

import { Grid, MenuItem, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'src/global'
import { OWL } from 'src/namespaces'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import { AgentRestriction, isNamedNode } from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const AgentRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, AgentRestriction>((state) =>
    _.get(state, [...keys])
  )

  // TODO: retrieve from AgentsContext or some part of the global store.
  let options: Option[] = []
  return isNamedNode(restriction[OWL.someValuesFrom]) ? (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          select
          label={'Agent'}
          onChange={(e) =>
            dispatch(
              actions.update(
                [...keys, OWL.someValuesFrom, '@id'],
                e.target.value
              )
            )
          }
          value={restriction[OWL.someValuesFrom]['@id']}
        >
          {!!options.length &&
            options.map(({ label, value }, i) => (
              <MenuItem key={i} value={value}>
                {label}
              </MenuItem>
            ))}
        </TextField>
      </Grid>
    </Grid>
  ) : null
}

import { Grid, MenuItem, TextField } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'src/global'
import { actions, selectAction } from 'src/store'

export interface ActionSectionProps {
  validActions: Option[]
}

export const ActionSection: React.FC<ActionSectionProps> = ({ validActions }) => {
  const dispatch = useDispatch()
  const action = useSelector(selectAction)

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label={'Action'}
          value={action['@id']}
          onChange={(e) => dispatch(actions.setAction(e.target.value))}
          disabled={!validActions.length}
        >
          {!!validActions.length &&
            validActions.map(({ label, value }, i) => (
              <MenuItem key={i} value={value}>
                {label}
              </MenuItem>
            ))}
        </TextField>
      </Grid>
    </Grid>
  )
}

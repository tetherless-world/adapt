import { Grid, MenuItem, TextField } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'src/global'
import { actions, selectEffect, selectPrecedence } from 'src/store'

export interface ConditionSectionProps {
  validPrecedences: Option[]
  validEffects: Option[]
}

export const ConditionSection: React.FC<ConditionSectionProps> = ({
  validPrecedences,
  validEffects,
}) => {
  const dispatch = useDispatch()
  const precedence = useSelector(selectPrecedence)
  const effect = useSelector(selectEffect)

  return (
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label={'Precedence'}
          value={precedence['@id']}
          onChange={(e) => dispatch(actions.setPrecedence(e.target.value))}
          disabled={!validPrecedences.length}
        >
          {validPrecedences.map(({ label, value }, i) => (
            <MenuItem key={i} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label={'Effect'}
          value={effect['@id']}
          onChange={(e) => dispatch(actions.setEffect(e.target.value))}
          disabled={!validEffects.length}
        >
          {validEffects.map(({ label, value }, i) => (
            <MenuItem key={i} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  )
}

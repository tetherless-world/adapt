import { Grid } from '@material-ui/core'
import { Selector } from 'src/components'
import { Option } from 'src/global'

export interface ConditionSectionProps {
  action: string
  setAction: React.Dispatch<React.SetStateAction<string>>
  validActions: Option[]
  precedence: string
  setPrecedence: React.Dispatch<React.SetStateAction<string>>
  validPrecedences: Option[]
}

export const ConditionSection: React.FC<ConditionSectionProps> = ({
  action,
  setAction,
  validActions,
  precedence,
  setPrecedence,
  validPrecedences,
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={6}>
      <Selector
        options={validActions}
        textFieldProps={{
          label: 'Action',
          value: action,
          onChange: (event: any) => setAction(event.target.value),
        }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <Selector
        options={validPrecedences}
        textFieldProps={{
          label: 'Precedence',
          value: precedence,
          onChange: (event: any) => setPrecedence(event.target.value),
        }}
      />
    </Grid>
  </Grid>
)

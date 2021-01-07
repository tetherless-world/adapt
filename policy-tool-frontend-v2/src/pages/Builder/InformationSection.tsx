import { Grid, TextField } from '@material-ui/core'
import { FormSection } from '../../components/FormSection/FormSection'
import { FormSectionHeader } from '../../components/FormSection/FormSectionHeader'
import { BuilderSection } from './common'

const fields = [
  { value: 'source', label: 'Source' },
  { value: 'id', label: 'ID' },
  { value: 'label', label: 'Label' },
  { value: 'definition', label: 'Definition' },
]

export const InformationSection: React.FC<BuilderSection> = ({
  policy,
}) => {
  const handleOnChange = (key: string) => (e: any) => {
    policy?.[key].set(e.target.value)
  }

  return (
    <Grid container>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <TextField
            label={'Source'}
            value={policy.source.get()}
            onChange={handleOnChange('source')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'ID'}
            value={policy.id.get()}
            onChange={handleOnChange('id')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'Label'}
            value={policy.label.get()}
            onChange={handleOnChange('label')}
          />
        </Grid>
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <TextField
            label={'Definition'}
            value={policy.definition.get()}
            onChange={handleOnChange('definition')}
            multiline
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

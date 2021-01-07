import { Grid, TextField } from '@material-ui/core'
import { BuilderSection } from './common'

const fields = [
  { value: 'source', label: 'Source' },
  { value: 'id', label: 'ID' },
  { value: 'label', label: 'Label' },
  { value: 'definition', label: 'Definition' },
]

export const InformationSection: React.FC<BuilderSection> = ({ policy }) => {
  return (
    <Grid container>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <TextField
            label={'Source'}
            value={policy.source.get()}
            onChange={(e) => policy.source.set(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'ID'}
            value={policy.id.get()}
            onChange={(e) => policy.id.set(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'Label'}
            value={policy.label.get()}
            onChange={(e) => policy.label.set(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <TextField
            label={'Definition'}
            value={policy.definition.get()}
            onChange={(e) => policy.definition.set(e.target.value)}
            multiline
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

import { Grid, TextField } from '@material-ui/core'

export interface InformationSectionProps {
  source: [source: string, setSource: Function]
  id: [id: any, setId: Function]
  label: [label: any, setLabel: Function]
  definition: [definition: any, setDefinition: Function]
}

export const InformationSection: React.FC<InformationSectionProps> = (
  props
) => {
  let [source, setSource] = props.source
  let [id, setId] = props.id
  let [label, setLabel] = props.label
  let [definition, setDefinition] = props.definition

  return (
    <Grid container>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <TextField
            label={'Source'}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'ID'}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'Label'}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={12}>
          <TextField
            label={'Definition'}
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            multiline
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

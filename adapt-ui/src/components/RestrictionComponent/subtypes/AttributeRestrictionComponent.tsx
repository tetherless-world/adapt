import { Grid, makeStyles, Typography } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { LabelByURIContext } from 'src/contexts'
import { OWL } from 'src/namespaces'
import { PolicyState } from 'src/types/policy'
import { AttributeRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'
import { RestrictionComponent } from '../RestrictionComponent'

const useStyles = makeStyles((theme) => ({
  label: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  child: {
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
}))

export const AttributeRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const labelByURI = useContext(LabelByURIContext)

  const restriction = useSelector<PolicyState, AttributeRestriction>((state) =>
    _.get(state, keys)
  )

  const classes = useStyles()
  const [n, ...rest] = restriction[OWL.someValuesFrom][OWL.intersectionOf]

  return (
    <Grid container item xs={12}>
      {!!n['@id'] && (
        <Grid item xs={12}>
          <Typography className={classes.label}>
            {labelByURI[n['@id']]}
          </Typography>
        </Grid>
      )}
      {!!rest.length &&
        rest.map((r, i) => (
          <Grid key={i} item xs={12} className={classes.child}>
            <RestrictionComponent
              keys={[...keys, OWL.someValuesFrom, OWL.intersectionOf, i + 1]}
            />
          </Grid>
        ))}
    </Grid>
  )
}

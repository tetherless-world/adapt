import { Grid, makeStyles, Typography, useTheme } from '@material-ui/core'
import _, { PropertyPath } from 'lodash'
import { Draft } from 'immer'
import { useContext } from 'react'
import { OptionMapContext } from '../../contexts/OptionMapContext'
import { InputWrapper } from '../InputWrapper'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginLeft: theme.spacing(2),
    },
    label: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
  }
})

export interface RestrictionProps {
  keys: PropertyPath
  restrictions: [restrictions: any[], updateRestrictions: Function]
}

export const Restriction: React.FC<RestrictionProps> = (props) => {
  let keys = _.toPath(props.keys)
  let [restrictions, updateRestrictions] = props.restrictions

  const theme = useTheme()
  const classes = useStyles(theme)
  const optionMap = useContext(OptionMapContext)

  const {
    uri,
    label,
    values,
    attributes,
  }: {
    uri: string
    label: string
    values?: any[]
    attributes?: any[]
  } = _.get(restrictions, keys)

  const options = optionMap[uri] ?? []

  return (
    <div className={classes.root}>
      {!!attributes?.length && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography className={classes.label}>{label}</Typography>
          </Grid>
          {attributes.map((_, i) => (
            <Grid item xs={12}>
              <Restriction
                keys={[...keys, 'attributes', i]}
                restrictions={[restrictions, updateRestrictions]}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {!!values?.length &&
        values.map(({ value, typeUri }: { value: any; typeUri: string }, i) => (
          <Grid item xs={12} md={6}>
            <InputWrapper
              typeUri={typeUri}
              options={options}
              textFieldProps={{
                value,
                onChange: (event: any) =>
                  updateRestrictions((draft: Draft<any[]>) =>
                    _.set(
                      draft,
                      [...keys, 'values', i, 'value'],
                      event.target.value
                    )
                  ),
              }}
            />
          </Grid>
        ))}
    </div>
  )
}

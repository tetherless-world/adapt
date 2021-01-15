import { Grid, makeStyles, Typography, useTheme } from '@material-ui/core'
import _, { PropertyPath } from 'lodash'
import { useContext } from 'react'
import { OptionMapContext } from 'src/contexts'
import { Restriction } from 'src/global'
import { InputWrapper } from './InputWrapper'

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
  restrictions: Restriction[]
  updateRestrictions: React.Dispatch<React.SetStateAction<Restriction[]>>
}

const updateValue = (keys: PropertyPath, value: any) => (
  prev: Restriction[]
): Restriction[] => _.cloneDeep(_.set(prev, keys, value))

export const RestrictionComponent: React.FC<RestrictionProps> = (props) => {
  let keys = _.toPath(props.keys)
  let { restrictions, updateRestrictions } = props

  const theme = useTheme()
  const classes = useStyles(theme)
  const optionMap = useContext(OptionMapContext)

  let restriction: Restriction = _.get(restrictions, keys)

  const options = optionMap[restriction.uri] ?? []

  return (
    <div className={classes.root}>
      {!!restriction?.attributes?.length && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography className={classes.label}>
              {restriction.label}
            </Typography>
          </Grid>
          {restriction.attributes.map((_, i) => (
            <Grid item xs={12}>
              <RestrictionComponent
                keys={[...keys, 'attributes', i]}
                restrictions={restrictions}
                updateRestrictions={updateRestrictions}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {!!restriction?.values?.length &&
        restriction.values.map((value, i) => (
          <Grid item xs={12} md={6}>
            <InputWrapper
              typeUri={value.type}
              options={options}
              textFieldProps={{
                value,
                onChange: (event: any) =>
                  updateRestrictions(
                    updateValue(
                      [...keys, 'values', i, 'value'],
                      event?.target?.value
                    )
                  ),
              }}
            />
          </Grid>
        ))}
    </div>
  )
}

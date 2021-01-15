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
      {!!restriction?.restrictions?.length && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography className={classes.label}>
              {restriction.label}
            </Typography>
          </Grid>
          {restriction.restrictions.map((_, i) => (
            <Grid item xs={12} key={i}>
              <RestrictionComponent
                keys={[...keys, 'restrictions', i]}
                restrictions={restrictions}
                updateRestrictions={updateRestrictions}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {!!restriction?.values?.length &&
        restriction.values.map(({ value, type }, i) => (
          <Grid container item xs={12} md={6} key={i}>
            <InputWrapper
              typeUri={type}
              options={options}
              textFieldProps={{
                label: restriction.label,
                value: value ?? '',
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

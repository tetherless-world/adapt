import React, { useMemo, useContext } from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'

import AttributeInput from './AttributeInput'
import AttributeOptionsContext from '../contexts/AttributeOptionsContext'

const handleChange = (setter) => (event) => setter(event.target.value)

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

export default function Attribute({ keys = [], policy }) {
  const classes = useStyles()

  const { options } = useContext(AttributeOptionsContext)

  const attribute = useMemo(() => policy.attributes.getValue(keys), [
    keys,
    policy,
  ])

  const { '@id': id, label, values, attributes } = attribute

  const attributeOptions = useMemo(() => (!!options && options[id]) ?? [], [
    options,
    attribute,
  ])

  return (
    <div className={classes.root}>
      {!!attribute?.attributes?.length && (
        <Grid item xs={12}>
          <Typography variant={'body1'} className={classes.label}>
            {label}
          </Typography>
        </Grid>
      )}
      <Grid container spacing={1}>
        {!!attributes?.length &&
          attributes.map((_, i) => (
            <Grid item xs={12}>
              <Attribute keys={[...keys, 'attributes', i]} policy={policy} />
            </Grid>
          ))}
        {!!values?.length &&
          values.map(({ '@value': v, '@type': t }, i) => (
            <Grid item xs={12} md={6}>
              <AttributeInput
                label={label}
                value={v}
                type_uri={t}
                attributeOptions={attributeOptions}
                onChange={handleChange(
                  policy.attributes.updateValue([
                    ...keys,
                    'values',
                    i,
                    '@value',
                  ])
                )}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  )
}

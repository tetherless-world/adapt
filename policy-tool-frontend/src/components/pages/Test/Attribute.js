import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import AttributeSelector from './AttributeSelector'
import Value from './Value'

const useStyles = makeStyles(theme => ({
  values: {
    paddingLeft: theme.spacing(4)
  }
}))

export default function Attribute ({
  attribute,
  validAttributes,
  onChangeAttribute,
  onChangeAttributeValue
}) {
  const classes = useStyles()
  return (
    <>
      <Grid container spacing={2} alignItems={'flex-end'}>
        <Grid item>
          <AttributeSelector
            attribute={attribute}
            onChangeAttribute={onChangeAttribute}
            validAttributes={validAttributes}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction={'column'}
        className={classes.values}
        spacing={2}
      >
        {attribute.values.map((value, key) => (
          <Grid item key={key}>
            <Value
              value={value}
              field={{
                id: key,
                label: key,
                options: [{ label: '0', value: '0' }],
                type: attribute.type
              }}
              onChange={onChangeAttributeValue(key)}
            />
          </Grid>
        ))}
      </Grid>

    </>
  )
}
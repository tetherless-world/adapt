import React from 'react'
import { makeStyles, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 300
  }
}))


export default function AttributeSelector ({
  attribute,
  onChangeAttribute,
  validAttributes
}) {
  const classes = useStyles()

  return (
    <>
      <FormControl className={classes.root}>
        <InputLabel>Attribute</InputLabel>
        <Select
          value={attribute.name}
          onChange={event => onChangeAttribute(event.target.value)}
        >
          {validAttributes.map((attribute, index) =>
            <MenuItem
              value={attribute.name}
              key={index}
            >
              {attribute.name}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </>
  )
}
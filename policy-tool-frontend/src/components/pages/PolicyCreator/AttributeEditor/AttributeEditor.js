import React from 'react'
import {
  Grid,
  Button,
  makeStyles,
  IconButton,
  FormControl
} from '@material-ui/core'
import { Clear as ClearIcon } from '@material-ui/icons'

import AttributeSelector from './AttributeSelector'
import AttributeValue from './AttributeValue'

import useAttributes from '../../../../functions/useAttributes'

const useStyles = makeStyles((theme) => ({
  root: {},
  attribute: {
    paddingTop: theme.spacing(1)
  },
  values: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(4)
  }
}))

export default function AttributeEditor({
  attributes,
  setAttributes,
  validAttributes
}) {
  const classes = useStyles()

  const {
    resetAttributes,
    addAttribute,
    updateAttribute,
    updateValue
  } = useAttributes(attributes, setAttributes)

  const handleClear = () => resetAttributes()
  const handleAddAttribute = () => addAttribute()

  const handleChangeSelectedAttribute = (index) => (uri) => {
    if (uri !== attributes[index].uri) {
      updateAttribute(index, {
        ...validAttributes.filter((a) => a.uri === uri).shift(),
        values: []
      })
    }
  }

  const handleAddAttributeValue = (index) => {
    updateAttribute(index, {
      ...attributes[index],
      values: [...attributes[index].values, null]
    })
  }

  const handleChangeAttributeValue = (index, valueIndex) => (value) => {
    updateValue(index, valueIndex, value)
  }

  const handleDeleteAttributeValue = (index, valueIndex) => {
    updateAttribute(index, {
      ...attributes[index],
      values: attributes[index].values.filter((_, i) => i !== valueIndex)
    })
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item>
          <Button onClick={handleAddAttribute}>Intersect</Button>
        </Grid>
        <Grid item>
          <Button onClick={handleClear}>Clear</Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {attributes.map((attribute, index) => (
            <div key={index}>
              <Grid
                container
                spacing={2}
                alignItems={'flex-end'}
                className={classes.attribute}
              >
                <Grid item xs={12} md={4}>
                  <AttributeSelector
                    attribute={attribute}
                    onChange={handleChangeSelectedAttribute(index)}
                    validAttributes={validAttributes}
                  />
                </Grid>

                <Grid item>
                  <Button
                    disabled={!attribute.uri}
                    onClick={() => handleAddAttributeValue(index)}
                  >
                    Union
                  </Button>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={4} className={classes.values}>
                  {attribute.values &&
                    attribute.values.map((value, valueIndex) => (
                      <div key={`${index}-${valueIndex}`}>
                        <Grid container alignItems={'flex-end'} spacing={2}>
                          <Grid item xs={10}>
                            <AttributeValue
                              value={value}
                              valueType={attribute.value_type}
                              onChange={handleChangeAttributeValue(
                                index,
                                valueIndex
                              )}
                              options={
                                !!attribute.subClasses
                                  ? attribute.subClasses.map((v) => ({
                                      label: v.label,
                                      value: v.uri
                                    }))
                                  : []
                              }
                            />
                          </Grid>
                          <Grid item>
                            <IconButton
                              size={'small'}
                              onClick={() =>
                                handleDeleteAttributeValue(index, valueIndex)
                              }
                              disabled={attribute.values.length === 1}
                            >
                              <ClearIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    ))}
                </Grid>
              </Grid>
            </div>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

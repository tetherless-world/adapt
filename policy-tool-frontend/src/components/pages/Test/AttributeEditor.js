import React from 'react'
import { Grid, Button, makeStyles, IconButton } from '@material-ui/core'
import { Clear as ClearIcon } from '@material-ui/icons'

import PreviewJson from '../../common/PreviewJson'
import AttributeSelector from './AttributeSelector'
import AttributeValue from './AttributeValue'
import useAttributes from '../../../functions/useAttributes'

import TextInput from './components/TextInput'
import UnknownField from './components/UnknownField'

const useStyles = makeStyles(theme => ({
  root: {},
  attribute: {
    paddingTop: theme.spacing(2)
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

  const { updateAttribute, updateValue } = useAttributes(
    attributes,
    setAttributes
  )

  const handleClearAll = () => {
    setAttributes([{ name: '', type: '', values: [] }])
  }

  const handleAddAttribute = () => {
    setAttributes(prev => [...prev, { name: '', type: '', values: [] }])
  }

  const handleChangeSelectedAttribute = index => name => {
    updateAttribute(index, validAttributes.filter(a => a.attributeName === name).shift())
  }

  const handleAddAttributeValue = index => {
    updateAttribute(index, {
      ...attributes[index],
      values: [...attributes[index].values, null]
    })
  }

  const handleChangeAttributeValue = (index, valueIndex) => value => {
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
      <Grid container spacing={4}>
        <Grid item>
          <Button onClick={handleAddAttribute}>Intersect</Button>
        </Grid>
        <Grid item>
          <Button onClick={handleClearAll}>Clear All</Button>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {attributes.map((attribute, index) => (
            <>
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
                  <Button onClick={() => handleAddAttributeValue(index)}>
                    Add value
                  </Button>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={4} className={classes.values}>
                  {attribute.values.map((value, valueIndex) => {
                    return (
                      <Grid container alignItems={'flex-end'} spacing={2}>
                        <Grid item xs={12} md={10}>
                          <AttributeValue
                            value={value}
                            onChange={handleChangeAttributeValue(index, valueIndex)}
                            typeInfo={attribute.typeInfo}
                            type={attribute}
                          />
                        </Grid>
                        <Grid item>
                          <IconButton
                            size={'small'}
                            onClick={() =>
                              handleDeleteAttributeValue(index, valueIndex)
                            }
                          >
                            <ClearIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </Grid>
      <div style={{ paddingTop: 30 }} />
      <Grid container item>
        <PreviewJson
          title={'Attributes'}
          data={attributes}
          toggleable={false}
        />
      </Grid>
    </>
  )
}

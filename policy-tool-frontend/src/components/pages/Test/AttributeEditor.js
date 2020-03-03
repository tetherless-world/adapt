import React from 'react'
import {
  Grid,
  Button,
  Select,
  FormControl,
  makeStyles,
  InputLabel,
  MenuItem,
  IconButton
} from '@material-ui/core'
import { Delete as DeleteIcon, Clear as ClearIcon } from '@material-ui/icons'

import PreviewJson from '../../common/PreviewJson'
import useAttributes from '../../../functions/useAttributes'
import SelectField from './components/SelectField'
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

export default function AttributeEditor() {
  const classes = useStyles()

  const validAttributes = [
    {
      name: 'Start Time',
      type: 'xsd:datetime',
      values: ['']
    },
    {
      name: 'End Time',
      type: 'xsd:datetime',
      values: ['']
    }
  ]

  const {
    attributes,
    setAttributes,
    updateAttribute,
    updateValue
  } = useAttributes()

  const handleClearAll = () => {
    setAttributes([{ name: '', type: '', values: [] }])
  }

  const handleAddAttribute = () => {
    setAttributes(prev => [...prev, { name: '', type: '', values: [] }])
  }

  const handleChangeSelectedAttribute = index => event => {
    updateAttribute(
      index,
      validAttributes.filter(a => a.name === event.target.value).shift()
    )
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
                  <FormControl fullWidth>
                    <InputLabel>Attribute</InputLabel>
                    <Select
                      value={attribute.name}
                      onChange={handleChangeSelectedAttribute(index)}
                    >
                      {validAttributes.map((option, index) => (
                        <MenuItem value={option.name} key={index}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    let FieldComponent = UnknownField

                    switch (attribute.type) {
                      case 'xsd:datetime':
                        FieldComponent = TextInput
                        break
                    }

                    return (
                      <Grid container alignItems={'flex-end'} spacing={2}>
                        <Grid item xs={12} md={10}>
                          <FieldComponent
                            key={valueIndex}
                            value={value}
                            field={{
                              id: `${valueIndex}`,
                              title: 'Value',
                              type: attribute.type
                            }}
                            onChange={handleChangeAttributeValue(
                              index,
                              valueIndex
                            )}
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

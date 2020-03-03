import React from 'react'
import {
  Grid,
  Button,
  Select,
  FormControl,
  makeStyles,
  InputLabel,
  MenuItem
} from '@material-ui/core'

import Attribute from './Attribute'

import PreviewJson from '../../common/PreviewJson'
import useAttributes from '../../../functions/useAttributes'
import SelectField from './components/SelectField'
import TextInput from './components/TextInput'
import UnknownField from './components/UnknownField'

export default function AttributeEditor() {
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

  const handleChangeSelectedAttribute = index => event => {
    updateAttribute(
      index,
      validAttributes.filter(a => a.name === event.target.value).shift()
    )
  }

  const handleChangeAttributeValue = (index, valueIndex) => value => {
    updateValue(index, valueIndex, value)
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          {attributes.map((attribute, index) => (
            <>
              <Grid container>
                <Grid item xs={12} sm={4}>
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
              </Grid>
              <Grid container>
                {attribute.values.map((value, valueIndex) => {
                  let FieldComponent = UnknownField

                  switch (attribute.type) {
                    case 'xsd:datetime':
                      FieldComponent = TextInput
                      break
                  }

                  return (
                    <Grid item xs={8}>
                      <FieldComponent
                        key={valueIndex}
                        value={value}
                        field={{
                          id: `${valueIndex}`,
                          title: 'Value',
                          type: attribute.type
                        }}
                        onChange={handleChangeAttributeValue(index, valueIndex)}
                      />
                    </Grid>
                  )
                })}
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

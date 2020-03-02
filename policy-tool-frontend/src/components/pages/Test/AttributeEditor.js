import React, { useState, useEffect } from 'react'
import { Grid, Divider, Button, Select, FormControl, makeStyles, InputLabel, MenuItem } from '@material-ui/core'

import Attribute from './Attribute'

import PreviewJson from '../../common/PreviewJson'
import useAttributes from '../../../functions/useAttributes'
import SelectField from './components/SelectField'
import UnknownField from './components/UnknownField'



export default function AttributeEditor () {

  const validAttributes = [
    {
      name: 'Start Time',
      type: 'xsd:datetime',
      values: []
    },
    {
      name: 'End Time',
      type: 'xsd:datetime',
      values: []
    }
  ]

  // const [attributes, setAttributes] = useState([])

  const { attributes, updateAttribute, setAttributes } = useAttributes();

  // useEffect(() => {
  //   setAttributes(prev => [
  //     ...prev,
  //     {
  //       name: '',
  //       type: '',
  //       values: []
  //     }
  //   ])
  // }, [])

  const handleChangeAttribute = (index, newAttribute) => {
    updateAttribute(index, newAttribute)
  }

  const handleChangeAttributeValue = index => key => value => {
    setAttributes(prev => {
      prev[index].values[key] = value
      return [...prev]
    })
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
                      onChange={event =>
                        updateAttribute(index,
                          validAttributes.filter(a => a.name === event.target.value)
                            .shift()
                        )}
                    >
                      {validAttributes.map((option, index) => (
                        <MenuItem
                          value={option.name}
                          key={index}
                        >
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {attribute.values.map((value, valueIndex) => {
                let FieldComponent = UnknownField

                switch (attribute.type) {
                  case 'xsd:datetime':
                    FieldComponent = SelectField
                    break
                }

                return (
                  <FieldComponent
                    key={valueIndex}
                    field={{ type: attribute.type, id: valueIndex, title: 'Value' }}
                    value={value}
                    onChange={(event) => {
                      updateAttribute(index,
                        {
                          ...attribute,
                          values: attribute.values.map((v, i) =>
                            i === valueIndex
                              ? event.target.value
                              : value
                          )
                        }
                      )
                    }}
                  />
                )
              })}
            </>
          ))}
        </Grid>
      </Grid>
      <div style={{ paddingTop: 30 }} />
      <Grid container item>
        <PreviewJson title={'Attributes'} data={attributes} toggleable={false} />
      </Grid>
    </>
  )
}
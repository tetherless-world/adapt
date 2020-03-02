import React, { useState, useEffect } from 'react'
import { Grid, Divider, Button } from '@material-ui/core'

import Attribute from './Attribute'

import PreviewJson from '../../common/PreviewJson'
import useAttributes from '../../../functions/useAttributes'


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

  const {attributes, updateAttribute, setAttributes} = useAttributes();

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

  const handleChangeAttribute = index => newAttribute => {
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
          {attributes && attributes.map((attribute, index) => {
            return (
              <div key={index}>
                <Grid container alignItems={'flex-end'}>
                  <Grid item>
                    <Attribute
                      attribute={attribute}
                      validAttributes={validAttributes}
                      onChangeAttribute={handleChangeAttribute(index)}
                      onChangeAttributeValue={handleChangeAttributeValue(index)}
                    />
                  </Grid>
                  <Grid item>
                    <Button onClick={() => {
                      setAttributes(prev => {
                        prev[index] = { ...prev[index], values: [...prev[index].values, null] }
                        return [...prev]
                      })
                    }}>
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </div>
            )
          })}
        </Grid>
      </Grid>
      <div style={{ paddingTop: 30 }} />
      <Grid container item>
        <PreviewJson title={'Attributes'} data={attributes} toggleable={false} />
      </Grid>
    </>
  )
}
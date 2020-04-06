import React, { useState, useMemo, useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'

import PolicyInfoForm from './PolicyInfoForm'
import PolicyConditionForm from './PolicyConditionForm'
import AttributeEditor from './AttributeEditor/AttributeEditor'
import PreviewJson from '../../common/PreviewJson'
import LoadingWrapper from '../../common/LoadingWrapper'

import {
  useGetValidAttributes,
  useGetValidConditions
} from '../../../functions/useAPI'

export default function PolicyCreator() {
  const [conditions, setConditions] = useState({
    action: '',
    precedence: '',
    effect: '',
    obligation: ''
  })

  const [info, setInfo] = useState({
    definition: '',
    id: '',
    label: '',
    source: ''
  })

  const [attributes, setAttributes] = useState([])
  const [resGetValidAttr, getValidAttributes] = useGetValidAttributes()
  const [resGetValidCond, getValidConditions] = useGetValidConditions()

  const isLoading = useMemo(() => {
    return resGetValidAttr.loading || resGetValidCond.loading
  }, [resGetValidAttr, resGetValidCond])

  const validAttributes = useMemo(() => {
    return resGetValidAttr.value || []
  }, [resGetValidAttr])

  
  const validConditons = useMemo(() => {
    return resGetValidCond.value || {}
  }, [resGetValidCond])

  useEffect(() => {
    getValidAttributes()
    getValidConditions()
  }, [])

  // Handling changes
  const handleOnChange = (setState) => (key) => (value) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <LoadingWrapper isLoading={isLoading}>
        <Grid container spacing={8}>
          <Grid item container xs={12} md={6}>
            <PolicyInfoForm values={info} onChange={handleOnChange(setInfo)} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'h5'}>Rules</Typography>
            <AttributeEditor
              attributes={attributes}
              setAttributes={setAttributes}
              validAttributes={validAttributes}
            />
          </Grid>
          <Grid item container xs={12}>
            <PolicyConditionForm
              values={conditions}
              fieldOptions={validConditons}
              onChange={handleOnChange(setConditions)}
            />
          </Grid>
          <Grid item container xs={12} md={6}>
            <PreviewJson
              title={'Policy Preview'}
              data={{ info, attributes, conditions }}
            />
          </Grid>
        </Grid>
      </LoadingWrapper>
    </>
  )
}

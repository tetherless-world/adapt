import React, { useMemo, useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Paper,
  makeStyles,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import ReactJson from 'react-json-view'

import RequestAttribute from '../components/RequestAttribute'
import MenuButton from '../components/MenuButton'

import useRequest from '../hooks/useRequest'
import {
  useGetValidRequestAttributes,
  useCreateRequest,
} from '../hooks/useAPI'

import AttributeOptionsContext from '../contexts/AttributeOptionsContext'
import LoadingWrapper from '../components/LoadingWrapper'
import SelectWrapper from '../components/SelectWrapper'
import FormSection from '../components/FormSection'

const useStyles = makeStyles((theme) => ({
  section: {
    paddingBottom: theme.spacing(3),
  },
  subSection: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

// CHANGE REQUEST INFORMATION
const handleChange = (setter) => (event) => setter(event.target.value)

// REQUEST BUILDER
export default function RequestBuilder() {
  const classes = useStyles()
  const request = useRequest() 
  const [showOutput, setShowOutput] = useState(false)

  const [validAttrResponse, getValidAttributes] = useGetValidRequestAttributes()
  const [createRequestResponse, createRequest] = useCreateRequest()

  useEffect(() => {
    getValidAttributes()
  }, [])

  const {
    attributes: validAttributes,
    options: validAttributeOptions,
  } = useMemo(() => validAttrResponse.value ?? {}, [validAttrResponse])


  const { output } = useMemo(() => createRequestResponse.value ?? '', [
    createRequestResponse,
  ])
  
  return (
    <>
      <LoadingWrapper>        
        <FormSection label={'Information'} className={classes.section}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={'ID'}
                value={request.state.id}
                onChange={handleChange(request.setId)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={'Label'}
                value={request.state.label}
                onChange={handleChange(request.setLabel)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Definition'}
                value={request.state.definition}
                onChange={handleChange(request.setDefinition)}
                multiline
              />
            </Grid>
          </Grid>
        </FormSection>

        <AttributeOptionsContext.Provider
          value={{ options: validAttributeOptions }}
        >
          <FormSection label={'Attributes'} className={classes.section}>
            <Grid container spacing={2}>
              <Grid container item xs={12}>
                <Grid item xs={12} sm={1}>
                  <MenuButton
                    options={validAttributes}
                    onSelect={(i) => {
                      request.attributes.add(validAttributes[i]?.default)
                    }}
                  >
                    Add
                  </MenuButton>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button
                    onClick={request.attributes.reset}
                    disabled={!request.state.attributes.length}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <Grid container item xs={12} spacing={2}>
                {request.state.attributes.map((_, i) => (
                  <Grid container item xs={12} alignItems={'stretch'}>
                    <Grid item xs={1}>
                      <IconButton onClick={() => request.attributes.delete(i)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                    <Grid item xs={11}>
                      <RequestAttribute keys={[i]} request={request} />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </FormSection>
        </AttributeOptionsContext.Provider>
        
        <FormSection label={'Preview'} className={classes.section}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper variant={'outlined'}>
                <ReactJson
                  name={'request'}
                  src={request.state}
                  enableClipboard={false}
                  displayDataTypes={false}
                />
              </Paper>
            </Grid>
          </Grid>
        </FormSection>

        <Button
          disabled={!request.isValid}
          onClick={() => {           
            setShowOutput(true)
            createRequest(request.state)
          }}
        >
          Save
        </Button>
      </LoadingWrapper>
      
      {showOutput && (
        <LoadingWrapper loading={createRequestResponse.loading}>
          <Paper>
            <pre>{output}</pre>
          </Paper>
        </LoadingWrapper>
      )}

    </>
  );
}

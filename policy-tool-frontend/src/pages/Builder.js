import React, { useMemo, useEffect, useState } from 'react'
import {
  Grid,
  TextField,
  Button,
  IconButton,
  Paper,
  makeStyles,
  Box,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import ReactJson from 'react-json-view'

import Attribute from '../components/Attribute'
import MenuButton from '../components/MenuButton'
import usePolicy from '../hooks/usePolicy'
import {
  useGetValidAttributes,
  useGetValidConditions,
  useCreatePolicy,
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

const handleChange = (setter) => (event) => setter(event.target.value)

export default function Builder() {
  const classes = useStyles()
  const policy = usePolicy()
  const [showOutput, setShowOutput] = useState(false)

  const [validAttrResponse, getValidAttributes] = useGetValidAttributes()
  const [validCondResponse, getValidConditions] = useGetValidConditions()
  const [createPolicyResponse, createPolicy] = useCreatePolicy()

  useEffect(() => {
    getValidAttributes()
    getValidConditions()
  }, [])

  const {
    attributes: validAttributes,
    options: validAttributeOptions,
  } = useMemo(() => validAttrResponse.value ?? {}, [validAttrResponse])

  const {
    actions: validActions,
    precedences: validPrecedences,
    effects: validEffects,
    obligations: validObligations,
  } = useMemo(() => validCondResponse.value ?? {}, [validCondResponse])

  const { output } = useMemo(() => createPolicyResponse.value ?? '', [
    createPolicyResponse,
  ])

  return (
    <>
      <LoadingWrapper
        loading={validAttrResponse.loading || validCondResponse.loading}
      >
        <FormSection label={'Information'} className={classes.section}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <SelectWrapper
                label={'Source'}
                value={policy.state.source}
                onChange={handleChange(policy.setSource)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={'ID'}
                value={policy.state.id}
                onChange={handleChange(policy.setId)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Label'}
                value={policy.state.label}
                onChange={handleChange(policy.setLabel)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={'Definition'}
                value={policy.state.definition}
                onChange={handleChange(policy.setDefinition)}
                multiline
              />
            </Grid>
          </Grid>
        </FormSection>
        <AttributeOptionsContext.Provider
          value={{ options: validAttributeOptions }}
        >
          <FormSection label={'Rules'} className={classes.section}>
            <Grid container spacing={2}>
              <Grid container item xs={12}>
                <Grid item xs={12} sm={1}>
                  <MenuButton
                    options={validAttributes}
                    onSelect={(i) => {
                      policy.attributes.add(validAttributes[i]?.default)
                    }}
                  >
                    Add
                  </MenuButton>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Button
                    onClick={policy.attributes.reset}
                    disabled={!policy.state.attributes.length}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <Grid container item xs={12} spacing={2}>
                {policy.state.attributes.map((_, i) => (
                  <Grid container item xs={12} alignItems={'stretch'}>
                    <Grid item xs={1}>
                      <IconButton onClick={() => policy.attributes.delete(i)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                    <Grid item xs={11}>
                      <Attribute keys={[i]} policy={policy} />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </FormSection>
        </AttributeOptionsContext.Provider>
        <FormSection label={'Conditions & Effects'} className={classes.section}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SelectWrapper
                label={'Action'}
                value={policy.state.action}
                onChange={handleChange(policy.setAction)}
                options={validActions}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectWrapper
                label={'Precedence'}
                value={policy.state.precedence}
                onChange={handleChange(policy.setPrecedence)}
                options={validPrecedences}
              />
            </Grid>
            <Grid item xs={12}>
              <FormSection
                LabelProps={{ variant: 'body1' }}
                label={'Effects'}
                className={classes.subSection}
              >
                <Grid container spacing={1}>
                  <Grid container item xs={12}>
                    <Grid item xs={12} sm={1}>
                      <MenuButton
                        options={[
                          { label: 'Effect', disabled: !validEffects?.length },
                          { label: 'Custom Effect' },
                        ]}
                        onSelect={(i) => {
                          policy.effects.add({
                            '@type':
                              i === 0
                                ? 'http://www.w3.org/2002/07/owl#Class'
                                : 'http://www.w3.org/2001/XMLSchema#string',
                            '@value': null,
                          })
                        }}
                      >
                        Add
                      </MenuButton>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button
                        onClick={policy.effects.reset}
                        disabled={!policy.state.effects.length}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    {policy.state.effects.map((effect, i) => {
                      const props = {
                        label: `Effect ${i}`,
                        onChange: handleChange(
                          policy.effects.updateValue([i, '@value'])
                        ),
                      }
                      return (
                        <Grid container item xs={12} alignItems={'center'}>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => policy.effects.delete(i)}
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                          <Grid item xs={11}>
                            {effect['@type'] ===
                            'http://www.w3.org/2002/07/owl#Class' ? (
                              <SelectWrapper
                                options={validEffects}
                                {...props}
                              />
                            ) : (
                              <TextField {...props} />
                            )}
                          </Grid>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </FormSection>
            </Grid>
            <Grid item xs={12}>
              <FormSection
                LabelProps={{ variant: 'body1' }}
                label={'Obligations'}
                className={classes.subSection}
              >
                <Grid container spacing={1}>
                  <Grid container item xs={12}>
                    <Grid item xs={12} sm={1}>
                      <MenuButton
                        options={[
                          {
                            label: 'Obligation',
                            disabled: !validObligations?.length,
                          },
                          { label: 'Custom Obligation' },
                        ]}
                        onSelect={(i) => {
                          policy.obligations.add({
                            '@type':
                              i === 0
                                ? 'http://www.w3.org/2002/07/owl#Class'
                                : 'http://www.w3.org/2001/XMLSchema#string',
                            '@value': null,
                          })
                        }}
                      >
                        Add
                      </MenuButton>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button
                        onClick={policy.obligations.reset}
                        disabled={!policy.state.obligations.length}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    {policy.state.obligations.map((obligation, i) => {
                      const props = {
                        label: `Obligation ${i}`,
                        onChange: handleChange(
                          policy.obligations.updateValue([i, '@value'])
                        ),
                      }
                      return (
                        <Grid container item xs={12} alignItems={'center'}>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => policy.obligations.delete(i)}
                            >
                              <Delete />
                            </IconButton>
                          </Grid>
                          <Grid item xs={11}>
                            {obligation['@type'] ===
                            'http://www.w3.org/2002/07/owl#Class' ? (
                              <SelectWrapper
                                options={validEffects}
                                {...props}
                              />
                            ) : (
                              <TextField {...props} />
                            )}
                          </Grid>
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </FormSection>
            </Grid>
          </Grid>
        </FormSection>
        <FormSection label={'Preview'} className={classes.section}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper variant={'outlined'}>
                <ReactJson
                  name={'policy'}
                  src={policy.state}
                  enableClipboard={false}
                  displayDataTypes={false}
                />
              </Paper>
            </Grid>
          </Grid>
        </FormSection>
        <Button
          disabled={!policy.isValid}
          onClick={() => {
            setShowOutput(true)
            createPolicy(policy.state)
          }}
        >
          Save
        </Button>
      </LoadingWrapper>
      {showOutput && (
        <Box marginTop={2}>
          <LoadingWrapper loading={createPolicyResponse.loading}>
            <Paper
              variant={'outlined'}
              component={'pre'}
              style={{ padding: 8, overflow: 'auto', maxHeight: 800 }}
            >
              {output}
            </Paper>
          </LoadingWrapper>
        </Box>
      )}
    </>
  )
}

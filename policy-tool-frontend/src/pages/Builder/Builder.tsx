import { Button, makeStyles } from '@material-ui/core'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormSection, FormSectionHeader, LoadingWrapper } from 'src/components'
import { LabelByURIContext, SubclassesByURIContext } from 'src/contexts'
import {
  useGetActions,
  useGetEffects,
  useGetPrecedences,
  useGetRestrictions,
  usePostPolicy,
} from 'src/hooks/api'
import { SKOS } from 'src/namespaces'
import { PolicyState } from 'src/types/policy'
import {
  ActionSection,
  AgentRestrictionSection,
  ConditionSection,
  InformationSection,
  ValidityRestrictionSection,
} from './sections'

const useStyles = makeStyles((theme) => ({
  section: {
    paddingBottom: theme.spacing(4),
  },
  save: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

const policyDefault = {
  id: 'ExamplePolicy',
  source: 'http://purl.org/twc/policy/',
  label: 'Example Policy',
  precedence: 'http://purl.org/twc/policy/example/dsa/Priority_1',
}

const flatten = (obj: Record<any, any>, prefix: string = '') =>
  Object.entries(obj).reduce((r: Record<any, any>, [key, val]) => {
    let k = `${prefix}${key}`
    if (val !== null && val !== undefined && typeof val === 'object')
      Object.assign(r, flatten(val, `${k}.`))
    else r[k] = val
    return r
  }, {})

const isValidPolicy = (state: PolicyState) => {
  let required = Object.keys(state)
    .filter((k) => k !== SKOS.definition)
    .reduce((obj, k) => ({ ...obj, [k]: state[k as keyof PolicyState] }), {})
  return Object.values(flatten(required)).every(
    (r) => r !== null && r !== undefined && r !== ''
  )
}

export const Builder: React.FC = () => {
  const classes = useStyles()
  const history = useHistory()

  const policy = useSelector<PolicyState, PolicyState>((state) => state)

  const [restrictionsRes, getRestrictions] = useGetRestrictions()
  const [effectsRes, getEffects] = useGetEffects()
  const [actionsRes, getActions] = useGetActions()
  const [precedencesRes, getPrecedences] = useGetPrecedences()
  const [policyRes, postPolicy] = usePostPolicy(policy)

  useEffect(() => {
    getRestrictions()
    getEffects()
    getActions()
    getPrecedences()
  }, [getRestrictions, getEffects, getActions, getPrecedences])

  useEffect(() => {
    if (!policyRes.loading && !!policyRes.value) {
      let url = `/view?uri=${encodeURIComponent(policyRes.value)}`
      history.push(url)
    }
  }, [policyRes, history])

  const isLoading = useMemo(
    () =>
      restrictionsRes.loading &&
      effectsRes.loading &&
      actionsRes.loading &&
      precedencesRes.loading,
    [restrictionsRes, effectsRes, actionsRes, precedencesRes]
  )

  const {
    validRestrictions,
    subclassesByURI,
    labelByURI,
  } = restrictionsRes.value ?? {
    validRestrictions: {},
    subclassesByURI: {},
    labelByURI: {},
  }
  const validEffects = effectsRes.value?.validEffects ?? []
  const validActions = actionsRes.value?.validActions ?? []
  const validPrecedences = precedencesRes.value?.validPrecedences ?? []

  const isValid = useMemo(() => isValidPolicy(policy), [policy])

  return (
    <LoadingWrapper loading={isLoading}>
      <LabelByURIContext.Provider value={labelByURI ?? {}}>
        <SubclassesByURIContext.Provider value={subclassesByURI ?? {}}>
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Policy Information'} />}
            body={<InformationSection />}
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Action'} />}
            body={<ActionSection validActions={validActions} />}
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Rules'} />}
            body={
              <AgentRestrictionSection validRestrictions={validRestrictions} />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Validity'} />}
            body={<ValidityRestrictionSection />}
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Conditions'} />}
            body={
              <ConditionSection
                validPrecedences={validPrecedences}
                validEffects={validEffects}
              />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.save }}
            body={
              <Button onClick={postPolicy} disabled={!isValid}>
                Save
              </Button>
            }
          />
        </SubclassesByURIContext.Provider>
      </LabelByURIContext.Provider>
    </LoadingWrapper>
  )
}

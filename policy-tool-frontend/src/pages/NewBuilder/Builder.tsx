import { Button, makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormSection, FormSectionHeader, LoadingWrapper } from 'src/components'
import {
  LabelByURIContext,
  SioClassByURIContext,
  SubclassesByURIContext,
} from 'src/contexts'
import {
  useGetActions,
  useGetEffects,
  useGetObligations,
  useGetPrecedences,
  useGetRestrictions,
  usePostPolicy,
} from 'src/hooks/api'
import { PolicyState } from 'src/types/policy'
import { AgentRestrictionSection, InformationSection } from './sections'
import { ValidityRestrictionSection } from './sections/ValidityRestrictionSection'

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

const flatten = (restrictions: any[]) => {
  let entries: any[] = []
  // restrictions.reduce((r, { restrictions: subRestrictions, values }) => {
  //   if (subRestrictions) {
  //     r.push(...flatten(subRestrictions))
  //   }
  //   if (values) {
  //     r.push(...values.map((v) => v.value))
  //   }
  //   return r
  // }, entries)
  return entries
}

const isValidPolicy = (state: PolicyState) => true

export const NewBuilder: React.FC = () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const history = useHistory()

  const policy = useSelector<PolicyState, PolicyState>((state) => state)

  const [restrictionsRes, getRestrictions] = useGetRestrictions()
  const [obligationsRes, getObligations] = useGetObligations()
  const [effectsRes, getEffects] = useGetEffects()
  const [actionsRes, getActions] = useGetActions()
  const [precedencesRes, getPrecedences] = useGetPrecedences()
  const [policyRes, postPolicy] = usePostPolicy(policy)

  useEffect(() => {
    getRestrictions()
    getObligations()
    getEffects()
    getActions()
    getPrecedences()
  }, [getRestrictions, getObligations, getEffects, getActions, getPrecedences])

  // useEffect(() => {
  //   if (!policyRes.loading && !!policyRes.value) {
  //     let url = `/view?uri=${encodeURIComponent(policyRes.value)}`
  //     history.push(url)
  //   }
  // }, [policyRes, history])

  const isLoading = useMemo(
    () =>
      restrictionsRes.loading &&
      obligationsRes.loading &&
      effectsRes.loading &&
      actionsRes.loading &&
      precedencesRes.loading,
    [restrictionsRes, obligationsRes, effectsRes, actionsRes, precedencesRes]
  )

  const {
    validRestrictions,
    subclassesByURI,
    labelByURI,
    sioClassByURI,
  } = restrictionsRes.value ?? {
    validRestrictions: {},
    subclassesByURI: {},
    labelByURI: {},
    sioClassByURI: {},
  }
  const validObligations = obligationsRes.value?.validObligations ?? []
  const validEffects = effectsRes.value?.validEffects ?? []
  const validActions = actionsRes.value?.validActions ?? []
  const validPrecedences = precedencesRes.value?.validPrecedences ?? []

  // const isValid = useMemo(() => isValidPolicy(state), [state])

  return (
    <LoadingWrapper loading={isLoading}>
      <LabelByURIContext.Provider value={labelByURI ?? {}}>
        <SubclassesByURIContext.Provider value={subclassesByURI ?? {}}>
          <SioClassByURIContext.Provider value={sioClassByURI ?? {}}>
            <FormSection
              gridContainerProps={{ className: classes.section }}
              header={<FormSectionHeader title={'Policy Information'} />}
              body={<InformationSection />}
            />
            <FormSection
              gridContainerProps={{ className: classes.section }}
              header={<FormSectionHeader title={'Rules'} />}
              body={
                <AgentRestrictionSection
                  validRestrictions={validRestrictions}
                />
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
              body={<></>}
            />
            <FormSection
              gridContainerProps={{ className: classes.section }}
              header={<FormSectionHeader title={'Effects'} />}
              body={<></>}
            />
            <FormSection
              gridContainerProps={{ className: classes.save }}
              body={
                <Button onClick={postPolicy} disabled>
                  Save
                </Button>
              }
            />
          </SioClassByURIContext.Provider>
        </SubclassesByURIContext.Provider>
      </LabelByURIContext.Provider>
    </LoadingWrapper>
  )
}

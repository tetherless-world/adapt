import { Button, makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FormSection, FormSectionHeader, LoadingWrapper } from 'src/components'
import { OptionMapContext, UnitMapContext } from 'src/contexts'
import { PolicyState, Restriction, Value } from 'src/global'
import {
  useGetActions,
  useGetEffects,
  useGetObligations,
  useGetPrecedences,
  useGetRestrictions,
  usePostPolicy,
} from 'src/hooks/api'
import {
  ConditionSection,
  EffectSection,
  InformationSection,
  ObligationSection,
  RestrictionSection,
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
  precedence: 'http://purl.org/twc/policy/example/dsa/Priority_1',
}

const flatten = (restrictions: Restriction[]) => {
  let entries: any[] = []
  restrictions.reduce((r, { restrictions: subRestrictions, values }) => {
    if (subRestrictions) {
      r.push(...flatten(subRestrictions))
    }
    if (values) {
      r.push(...values.map((v) => v.value))
    }
    return r
  }, entries)
  return entries
}

const isValidPolicy = (state: PolicyState) =>
  !!state.id &&
  !!state.source &&
  !!state.action &&
  !!state.precedence &&
  !!state.effects.length &&
  !!state.effects.every(({ value }) => value || false) &&
  !!state.obligations.every(({ value }) => value || false) &&
  !!flatten(state.activityRestrictions).every((v) => v || false) &&
  !!flatten(state.agentRestrictions).every((v) => v || false)

export const Builder: React.FC = () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const history = useHistory()

  const [id, setId] = useState<string>(policyDefault.id)
  const [source, setSource] = useState<string>(policyDefault.source)
  const [label, setLabel] = useState<string>('')
  const [definition, setDefinition] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [precedence, setPrecedence] = useState<string>(policyDefault.precedence)
  //prettier-ignore
  const [agentRestrictions, updateAgentRestrictions] = useState<Restriction[]>([])
  //prettier-ignore
  const [activityRestrictions, updateActivityRestrictions] = useState<Restriction[]>([])
  const [effects, updateEffects] = useState<Value[]>([])
  const [obligations, updateObligations] = useState<Value[]>([])

  const state = useMemo(
    () => ({
      id,
      source,
      label,
      definition,
      action,
      precedence,
      agentRestrictions,
      activityRestrictions,
      effects,
      obligations,
    }),
    [
      id,
      source,
      label,
      definition,
      action,
      precedence,
      agentRestrictions,
      activityRestrictions,
      effects,
      obligations,
    ]
  )

  const [restrictionsRes, getRestrictions] = useGetRestrictions()
  const [obligationsRes, getObligations] = useGetObligations()
  const [effectsRes, getEffects] = useGetEffects()
  const [actionsRes, getActions] = useGetActions()
  const [precedencesRes, getPrecedences] = useGetPrecedences()
  const [policyRes, postPolicy] = usePostPolicy(state)

  useEffect(() => {
    getRestrictions()
    getObligations()
    getEffects()
    getActions()
    getPrecedences()
  }, [getRestrictions, getObligations, getEffects, getActions, getPrecedences])

  useEffect(() => {
    if (!policyRes.loading && !!policyRes.value) {
      let url = `/view?uri=${encodeURIComponent(policyRes.value)}`
      history.push(url)
    }
  }, [policyRes, history])

  const isLoading = useMemo(
    () =>
      restrictionsRes.loading &&
      obligationsRes.loading &&
      effectsRes.loading &&
      actionsRes.loading &&
      precedencesRes.loading,
    [restrictionsRes, obligationsRes, effectsRes, actionsRes, precedencesRes]
  )

  const { validRestrictions, optionsMap, unitsMap } = restrictionsRes.value ?? {
    validRestrictions: [],
    optionsMap: {},
    unitsMap: {},
  }
  const validObligations = obligationsRes.value?.validObligations ?? []
  const validEffects = effectsRes.value?.validEffects ?? []
  const validActions = actionsRes.value?.validActions ?? []
  const validPrecedences = precedencesRes.value?.validPrecedences ?? []

  const isValid = useMemo(() => isValidPolicy(state), [state])

  return (
    <LoadingWrapper loading={isLoading}>
      <OptionMapContext.Provider value={optionsMap ?? {}}>
        <UnitMapContext.Provider value={unitsMap ?? {}}>
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Policy Information'} />}
            body={
              <InformationSection
                id={[id, setId]}
                source={[source, setSource]}
                label={[label, setLabel]}
                definition={[definition, setDefinition]}
              />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Rules'} />}
            body={
              <RestrictionSection
                restrictions={agentRestrictions}
                updateRestrictions={updateAgentRestrictions}
                validRestrictions={validRestrictions ?? []}
              />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Validity'} />}
            body={
              <RestrictionSection
                restrictions={activityRestrictions}
                updateRestrictions={updateActivityRestrictions}
                validRestrictions={[]}
              />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Conditions'} />}
            body={
              <ConditionSection
                action={action}
                setAction={setAction}
                validActions={validActions}
                precedence={precedence}
                setPrecedence={setPrecedence}
                validPrecedences={validPrecedences}
              />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Effects'} />}
            body={
              <EffectSection
                effects={effects}
                updateEffects={updateEffects}
                validEffects={validEffects}
              />
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Obligations'} />}
            body={
              <ObligationSection
                obligations={obligations}
                updateObligations={updateObligations}
                validObligations={validObligations}
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
        </UnitMapContext.Provider>
      </OptionMapContext.Provider>
    </LoadingWrapper>
  )
}

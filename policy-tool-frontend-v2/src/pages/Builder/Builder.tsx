import { Button, makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useMemo, useState } from 'react'
import { FormSection, FormSectionHeader, LoadingWrapper } from 'src/components'
import { OptionMapContext, UnitMapContext } from 'src/contexts'
import { Restriction, Value } from 'src/global'
import {
  useGetActions,
  useGetEffects,
  useGetObligations,
  useGetPrecedences,
  useGetRestrictions,
} from 'src/hooks/api'
import {
  EffectSection,
  InformationSection,
  ObligationSection,
  RestrictionSection,
} from './sections'
import { ConditionSection } from './sections/ConditionSection'

const useStyles = makeStyles((theme) => ({
  section: {
    paddingBottom: theme.spacing(3),
  },
}))

// const getIdentifier = (source: string, id: string): string => {
//   let lastChar = source.charAt(source.length - 1)
//   return lastChar === '#' || lastChar === '/'
//     ? `${source}${id}`
//     : `${source}#${id}`
// }

export const Builder: React.FC = () => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const [id, setId] = useState<string>('')
  const [source, setSource] = useState<string>('')
  const [label, setLabel] = useState<string>('')
  const [definition, setDefinition] = useState<string>('')
  const [action, setAction] = useState<string>('')
  const [precedence, setPrecedence] = useState<string>('')
  //prettier-ignore
  const [agentRestrictions, updateAgentRestrictions] = useState<Restriction[]>([])
  //prettier-ignore
  const [activityRestrictions, updateActivityRestrictions] = useState<Restriction[]>([])
  const [effects, updateEffects] = useState<Value[]>([])
  const [obligations, updateObligations] = useState<Value[]>([])

  const state = {
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
  }
  const [restrictionsRes, getRestrictions] = useGetRestrictions()
  const [obligationsRes, getObligations] = useGetObligations()
  const [effectsRes, getEffects] = useGetEffects()
  const [actionsRes, getActions] = useGetActions()
  const [precedencesRes, getPrecedences] = useGetPrecedences()

  useEffect(() => {
    getRestrictions()
    getObligations()
    getEffects()
    getActions()
    getPrecedences()
  }, [getRestrictions, getObligations, getEffects, getActions, getPrecedences])

  const isLoading = useMemo(
    () =>
      restrictionsRes.loading &&
      obligationsRes.loading &&
      effectsRes.loading &&
      actionsRes.loading &&
      precedencesRes.loading,
    [restrictionsRes, obligationsRes, effectsRes, actionsRes, precedencesRes]
  )

  const { validRestrictions, optionsMap, unitsMap } = useMemo(
    () =>
      restrictionsRes.value ?? {
        validRestrictions: [],
        optionsMap: {},
        unitsMap: {},
      },
    [restrictionsRes]
  )

  const validObligations = obligationsRes.value?.validObligations ?? []
  const validEffects = effectsRes.value?.validEffects ?? []
  const validActions = actionsRes.value?.validActions ?? []
  const validPrecedences = precedencesRes.value?.validPrecedences ?? []

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
            gridContainerProps={{ className: classes.section }}
            body={
              <Button
                onClick={() => {
                  console.log(state)
                }}
              >
                Save
              </Button>
            }
          />
        </UnitMapContext.Provider>
      </OptionMapContext.Provider>
    </LoadingWrapper>
  )
}

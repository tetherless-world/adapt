import { Grid, makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useMemo, useState } from 'react'
import { OptionMapContext, UnitMapContext } from 'src/contexts'
import { Restriction, Value } from 'src/global'
import {
  FormSection,
  FormSectionHeader,
  LoadingWrapper,
  Selector,
} from 'src/components'
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

  const { validRestrictions, optionsMap, unitsMap } =
    restrictionsRes.value ?? {}

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
            header={<FormSectionHeader title={'Information'} />}
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
            header={<FormSectionHeader title={'Activity Restrictions'} />}
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
            header={<FormSectionHeader title={'Agent Restrictions'} />}
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
            header={<FormSectionHeader title={'Policy Conditions'} />}
            body={
              <>
                <Grid container spacing={2}>
                  <Grid item>
                    <Selector
                      options={validActions}
                      textFieldProps={{
                        label: 'Action',
                        value: action,
                        onChange: (event: any) => setAction(event.target.value),
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Selector
                      options={validPrecedences}
                      textFieldProps={{
                        label: 'Precedence',
                        value: precedence,
                        onChange: (event: any) =>
                          setPrecedence(event.target.value),
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            }
          />
          <FormSection
            gridContainerProps={{ className: classes.section }}
            header={<FormSectionHeader title={'Policy Effects'} />}
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
            header={<FormSectionHeader title={'Policy Effects'} />}
            body={
              <ObligationSection
                obligations={obligations}
                updateObligations={updateObligations}
                validObligations={validObligations}
              />
            }
          />
        </UnitMapContext.Provider>
      </OptionMapContext.Provider>
    </LoadingWrapper>
  )
}

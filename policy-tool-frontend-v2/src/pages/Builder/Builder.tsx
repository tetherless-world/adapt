import { Grid, makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useMemo, useState } from 'react'
import { FormSection } from '../../components/FormSection/FormSection'
import { FormSectionHeader } from '../../components/FormSection/FormSectionHeader'
import { LoadingWrapper } from '../../components/LoadingWrapper'
import { Selector } from '../../components/Selector'
import { OptionMapContext } from '../../contexts/OptionMapContext'
import { UnitMapContext } from '../../contexts/UnitsMapContext'
import { Restriction, Value } from '../../global'
import * as api from '../../hooks/api'
import { EffectSection } from './EffectSection'
import { InformationSection } from './InformationSection'
import { RestrictionSection } from './RestrictionSection'
import { ObligationSection } from './ObligationSection'

const useStyles = makeStyles((theme) => ({
  section: {
    paddingBottom: theme.spacing(3),
  },
}))

const getIdentifier = (source: string, id: string): string => {
  let lastChar = source.charAt(source.length - 1)
  return lastChar === '#' || lastChar === '/'
    ? `${source}${id}`
    : `${source}#${id}`
}

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

  const restrictionsApi = api.useGetRestrictions()
  const obligationsApi = api.useGetObligations()
  const effectsApi = api.useGetEffects()
  const actionsApi = api.useGetActions()
  const precedencesApi = api.useGetPrecedences()

  useEffect(() => {
    restrictionsApi.dispatch()
    obligationsApi.dispatch()
    effectsApi.dispatch()
    actionsApi.dispatch()
    precedencesApi.dispatch()
  }, [])

  const isLoading = useMemo(
    () =>
      restrictionsApi.response.loading &&
      obligationsApi.response.loading &&
      effectsApi.response.loading &&
      actionsApi.response.loading &&
      precedencesApi.response.loading,
    [
      restrictionsApi.response,
      obligationsApi.response,
      effectsApi.response,
      actionsApi.response,
      precedencesApi.response,
    ]
  )

  const { validRestrictions, optionsMap, unitsMap } =
    restrictionsApi.response.value ?? {}

  const validObligations = obligationsApi.response.value?.validObligations ?? []
  const validEffects = effectsApi.response.value?.validEffects ?? []
  const validActions = actionsApi.response.value?.validActions ?? []
  const validPrecedences = precedencesApi.response.value?.validPrecedences ?? []

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

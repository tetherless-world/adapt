import { makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import { FormSection } from '../../components/FormSection/FormSection'
import { FormSectionHeader } from '../../components/FormSection/FormSectionHeader'
import { LoadingWrapper } from '../../components/LoadingWrapper'
import { ActivityRestrictionSection } from './ActivityRestrictionSection'
import { AgentRestrictionSection } from './AgentRestrictionSection'
import { InformationSection } from './InformationSection'
import * as api from '../../hooks/api'
import { OptionMapContext } from '../../contexts/OptionMapContext'
import { UnitMapContext } from '../../contexts/UnitsMapContext'
import { EffectSection } from './EffectSection'
import { Restriction, Value } from '../../global'

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
  const [agentRestrictions, updateAgentRestrictions] = useImmer<Restriction[]>([])
  //prettier-ignore
  const [activityRestrictions, updateActivityRestrictions] = useImmer<Restriction[]>([])
  const [effects, updateEffects] = useImmer<Value[]>([])

  const [attributesResponse, dispatchGetAttributes] = api.useGetAttributes()

  useEffect(() => {
    dispatchGetAttributes()
  }, [])

  const { validRestrictions, optionsMap, unitsMap } =
    attributesResponse.value ?? {}

  return (
    <LoadingWrapper loading={attributesResponse.loading}>
      <OptionMapContext.Provider value={optionsMap ?? {}}>
        <UnitMapContext.Provider value={unitsMap ?? {}}>
        <FormSection
          header={<FormSectionHeader title={'Information'} />}
          body={
            <InformationSection
              id={[id, setId]}
              source={[source, setSource]}
              label={[label, setLabel]}
              definition={[definition, setDefinition]}
            />
          }
          gridContainerProps={{ className: classes.section }}
        />
        <FormSection
          header={<FormSectionHeader title={'Activity Restrictions'} />}
          body={
            <ActivityRestrictionSection
              activityRestrictions={activityRestrictions}
              updateActivityRestrictions={updateActivityRestrictions}
            />
          }
          gridContainerProps={{ className: classes.section }}
        />
        <FormSection
          header={<FormSectionHeader title={'Agent Restrictions'} />}
          body={
            <AgentRestrictionSection
              agentRestrictions={agentRestrictions}
              updateAgentRestrictions={updateAgentRestrictions}
            />
          }
          gridContainerProps={{ className: classes.section }}
        />
        </UnitMapContext.Provider>
      </OptionMapContext.Provider>
    </LoadingWrapper>
  )
}

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
  const [agentRestrictions, updateAgentRestrictions] = useImmer<any[]>([])
  const [activityRestrictions, updateActivityRestrictions] = useImmer<any[]>([])
  const [effects, updateEffects] = useImmer<any[]>([])

  const [
    restrictionsResponse,
    dispatchGetRestrictions,
  ] = api.useGetRestrictions()

  useEffect(() => {
    dispatchGetRestrictions()
  }, [])

  // const root = getIdentifier(source, id)

  // const output = {
  //   [root]: {
  //     a: 'owl:Class',
  //     'rdf:label': label ?? id,
  //     'skos:definition': definition,
  //     'owl:subClassOf': [precedence, ...effects],
  //     'owl:equivalentClass': {
  //       a: 'owl:Class',
  //       'owl:intersectionOf': [
  //         action,
  //         ...agentRestrictions,
  //         ...activityRestrictions,
  //       ],
  //     },
  //   },
  // }

  return (
    <LoadingWrapper loading={restrictionsResponse.loading}>
      <OptionMapContext.Provider value={{}}>
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
              activityRestrictions={[
                activityRestrictions,
                updateActivityRestrictions,
              ]}
            />
          }
          gridContainerProps={{ className: classes.section }}
        />
        <FormSection
          header={<FormSectionHeader title={'Agent Restrictions'} />}
          body={
            <AgentRestrictionSection
              agentRestrictions={[agentRestrictions, updateAgentRestrictions]}
            />
          }
          gridContainerProps={{ className: classes.section }}
        />
      </OptionMapContext.Provider>
    </LoadingWrapper>
  )
}

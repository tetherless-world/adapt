import { makeStyles, useTheme } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { FormSection } from '../../components/FormSection/FormSection'
import { FormSectionHeader } from '../../components/FormSection/FormSectionHeader'
import { LoadingWrapper } from '../../components/LoadingWrapper'
import { OptionMapContext } from '../../contexts/OptionMapContext'
import { UnitMapContext } from '../../contexts/UnitsMapContext'
import { Restriction, Value } from '../../global'
import * as api from '../../hooks/api'
import { EffectSection } from './EffectSection'
import { InformationSection } from './InformationSection'
import { RestrictionSection } from './RestrictionSection'

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
              <RestrictionSection
                restrictions={activityRestrictions}
                updateRestrictions={updateActivityRestrictions}
                validRestrictions={[]}
              />
            }
            gridContainerProps={{ className: classes.section }}
          />
          <FormSection
            header={<FormSectionHeader title={'Agent Restrictions'} />}
            body={
              <RestrictionSection
                restrictions={agentRestrictions}
                updateRestrictions={updateAgentRestrictions}
                validRestrictions={validRestrictions ?? []}
              />
            }
            gridContainerProps={{ className: classes.section }}
          />
          <FormSection
            header={<FormSectionHeader title={'Policy Effects'} />}
            body={
              <EffectSection
                effects={effects}
                updateEffects={updateEffects}
                validEffects={[]}
              />
            }
          />
        </UnitMapContext.Provider>
      </OptionMapContext.Provider>
    </LoadingWrapper>
  )
}

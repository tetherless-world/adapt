import { makeStyles, useTheme } from '@material-ui/core'
import { FormSection } from '../../components/FormSection/FormSection'
import { FormSectionHeader } from '../../components/FormSection/FormSectionHeader'
import { LoadingWrapper } from '../../components/LoadingWrapper'
import { usePolicy } from '../../hooks/usePolicy'
import { ActivityRestrictionSection } from './ActivityRestrictionSection'
import { AgentRestrictionSection } from './AgentRestrictionSection'
import { InformationSection } from './InformationSection'

const useStyles = makeStyles((theme) => ({
  section: {
    paddingBottom: theme.spacing(3),
  },
}))

const Builder = () => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const policy = usePolicy()

  return (
    <LoadingWrapper loading={false}>
      <FormSection
        header={<FormSectionHeader title={'Information'} />}
        body={<InformationSection policy={policy} />}
        gridContainerProps={{ className: classes.section }}
      />
      <FormSection
        header={<FormSectionHeader title={'Activity Restrictions'} />}
        body={<ActivityRestrictionSection policy={policy} />}
        gridContainerProps={{ className: classes.section }}
      />
      <FormSection
        header={<FormSectionHeader title={'Agent Restrictions'} />}
        body={<AgentRestrictionSection policy={policy} />}
        gridContainerProps={{ className: classes.section }}
      />
    </LoadingWrapper>
  )
}

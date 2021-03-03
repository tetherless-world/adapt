import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import _ from 'lodash'
import { useContext, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuButton } from 'src/components'
import { RestrictionComponent } from 'src/components/'
import { LabelByURIContext } from 'src/contexts'
import { OWL } from 'src/namespaces'
import { actions, selectRestrictions } from 'src/store'
import { AgentRestriction, isAgentRestriction } from 'src/types/restrictions'
import { useRestrictionSectionStyles } from './common'

export interface AgentRestrictionSectionProps {
  validRestrictions: Record<string, AgentRestriction>
}

export const AgentRestrictionSection: React.FC<AgentRestrictionSectionProps> = ({
  validRestrictions,
}) => {
  const classes = useRestrictionSectionStyles()

  const dispatch = useDispatch()

  const labelByURI = useContext(LabelByURIContext)
  const restrictions = useSelector(selectRestrictions)

  const iMax = useMemo(() => {
    let [a, ...rest] = restrictions
    let iMax = _.findLastIndex(rest, isAgentRestriction)
    if (iMax === -1) return -1
    return iMax + 1
  }, [restrictions])

  const agentRestrictions = useMemo(() => {
    if (iMax === -1) return []
    return restrictions.slice(1, iMax + 1)
  }, [restrictions, iMax])

  const restrictionURIs: string[] = Object.keys(validRestrictions)
  const restrictionOptions = restrictionURIs
    .map((uri) => ({ uri, label: labelByURI[uri] }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const handleSelectOption = (i: number) => {
    let option = restrictionOptions[i]
    let restriction = _.cloneDeep(validRestrictions[option.uri])
    let action = actions.addAgentRestriction(restriction)
    dispatch(action)
  }

  const handleResetAgentRestrictions = () => {
    dispatch(actions.resetAgentRestrictions())
  }

  const handleDeleteAgentRestriction = (i: number) => () => {
    dispatch(actions.deleteAgentRestriction(i))
  }

  return (
    <Grid container>
      <Grid container item xs={12} className={classes.header}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={1}>
            <Typography variant={'h6'}>Rules</Typography>
          </Grid>
          <Grid item xs={12} md={'auto'}>
            <MenuButton
              // TODO: redo this component, it's not right
              options={restrictionOptions}
              onSelectOption={handleSelectOption}
              buttonProps={{
                children: 'Add',
                disabled: !restrictionOptions.length,
              }}
            />
          </Grid>
          <Grid item xs={12} md={'auto'}>
            <Button onClick={handleResetAgentRestrictions}>Reset</Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container item spacing={2}>
        {agentRestrictions.map((r, i) => (
          <Grid
            container
            item
            key={i}
            xs={8}
            alignItems={'flex-start'}
            className={classes.restrictions}
          >
            <Grid item xs={1}>
              <IconButton onClick={handleDeleteAgentRestriction(i)}>
                <Delete />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              <RestrictionComponent
                keys={[OWL.equivalentClass, OWL.intersectionOf, i + 1]}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}

import { Button, Grid, IconButton } from '@material-ui/core'
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

export interface AgentRestrictionSectionProps {
  validRestrictions: Record<string, AgentRestriction>
}

export const AgentRestrictionSection: React.FC<AgentRestrictionSectionProps> = ({
  validRestrictions,
}) => {
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
  const restrictionLabels = restrictionURIs.map((uri) => labelByURI[uri])
  const restrictionOptions = restrictionURIs.map((uri) => ({
    label: labelByURI[uri],
    value: uri,
  }))

  const handleSelectOption = (i: number) => {
    let uri = restrictionURIs[i]
    let restriction = _.cloneDeep(validRestrictions[uri])
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
    <>
      <Grid container item spacing={2}>
        <Grid item xs={12} md={4}>
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
        <Grid item xs={12} md={4}>
          <Button onClick={handleResetAgentRestrictions}>Reset</Button>
        </Grid>
        <Grid container item spacing={2}>
          {agentRestrictions.map((r, i) => {
            return (
              <Grid
                container
                item
                xs={12}
                spacing={1}
                alignItems={'flex-start'}
                key={i}
              >
                <Grid item>
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
            )
          })}
        </Grid>
      </Grid>
    </>
  )
}

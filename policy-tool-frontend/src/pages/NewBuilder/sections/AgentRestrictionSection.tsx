import { Button, Grid, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { createSelector } from '@reduxjs/toolkit'
import _, { Dictionary } from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuButton } from 'src/components'
import { RestrictionComponent } from 'src/components/NewRestrictionComponent/RestrictionComponent'
import { LabelByURIContext } from 'src/contexts'
import { useLabels } from 'src/hooks/useLabels'
import { actions } from 'src/store'
import { restrictionsSelector } from 'src/store/policy'
import {
  AgentRestriction,
  isAgentRestriction,
  isRestrictionNode,
} from 'src/types/restrictions'

export interface AgentRestrictionSectionProps {
  validRestrictions: Dictionary<AgentRestriction>
}

const agentRestrictionsSelector = createSelector(
  restrictionsSelector,
  (restrictions) => {
    let iMin = restrictions.findIndex(
      (r) => isRestrictionNode(r) && isAgentRestriction(r)
    )
    let iMax = restrictions.findIndex(
      (r) => isRestrictionNode(r) && !isAgentRestriction(r)
    )
    if (iMin === -1) return []
    if (iMax === -1) {
      let len = restrictions.length
      return restrictions.slice(1, len - 1) as AgentRestriction[]
    } else {
      return restrictions.slice(iMin, iMax - iMin) as AgentRestriction[]
    }
  }
)

export const AgentRestrictionSection: React.FC<AgentRestrictionSectionProps> = ({
  validRestrictions,
}) => {
  const dispatch = useDispatch()

  const labelByURI = useContext(LabelByURIContext)
  const restrictions = useSelector(agentRestrictionsSelector)

  const restrictionURIs: string[] = Object.keys(validRestrictions)

  const restrictionLabels = useLabels(labelByURI, restrictionURIs)

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
            options={restrictionLabels}
            onSelectOption={handleSelectOption}
            buttonProps={{
              children: 'Add',
              disabled: !validRestrictions.length,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button onClick={handleResetAgentRestrictions}>Reset</Button>
        </Grid>
        <Grid container item spacing={2}>
          {restrictions.map((r, i) => (
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
                  keys={['owl:equivalentClass', 'owl:intersectionOf', i + 1]}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

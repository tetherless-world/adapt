import { Button, Grid, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { createSelector } from '@reduxjs/toolkit'
import _, { Dictionary } from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from 'src/store'
import { MenuButton } from 'src/components'
import { RestrictionComponent } from 'src/components/NewRestrictionComponent/RestrictionComponent'
import { LabelByURIContext } from 'src/contexts'
import { AgentRestriction, NewPolicyState } from 'src/global'
import { restrictionsSelector } from 'src/store/policy'

export interface AgentRestrictionSectionProps {
  validRestrictions: Dictionary<AgentRestriction>
}

const agentRestrictionsSelector = createSelector(
  restrictionsSelector,
  (restrictions) => {
    let [a, ...rest] = restrictions
    let i = _.findLastIndex(
      rest,
      (r) => r['owl:onProperty'] === 'prov:wasAssociatedWith'
    )
    return restrictions.slice(1, i + 1) as AgentRestriction[]
  }
)

export const AgentRestrictionSection: React.FC<AgentRestrictionSectionProps> = ({
  validRestrictions,
}) => {
  const dispatch = useDispatch()
  const labelByURI = useContext(LabelByURIContext)
  const restrictions = useSelector(agentRestrictionsSelector)
  const restrictionURIs: string[] = Object.keys(validRestrictions)
  const restrictionLabels = restrictionURIs.map((r) => ({
    label: labelByURI[r],
  }))

  return (
    <>
      <Grid container item spacing={2}>
        <Grid item xs={12} md={4}>
          <MenuButton
            options={restrictionLabels}
            onSelectOption={(i) =>
              dispatch(
                actions.addAgentRestriction(
                  validRestrictions[restrictionURIs[i]]
                )
              )
            }
            buttonProps={{
              children: 'Add',
              disabled: !validRestrictions.length,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button onClick={() => dispatch(actions.resetAgentRestrictions)}>
            Reset
          </Button>
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
                <IconButton onClick={() => actions.deleteAgentRestriction(i)}>
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

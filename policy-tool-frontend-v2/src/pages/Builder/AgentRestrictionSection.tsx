import { Button, Grid } from '@material-ui/core'
import { Draft } from 'immer'
import _ from 'lodash'
import { Updater } from 'use-immer'
import { MenuButton } from '../../components/MenuButton'
import { Restriction } from '../../global'

export interface AgentRestrictionSectionProps {
  agentRestrictions: Restriction[]
  updateAgentRestrictions: Updater<Restriction[]>
  validRestrictions: Restriction[]
}

const add = (attribute: Restriction) => (draft: Draft<Restriction[]>) =>
  void draft.push(_.cloneDeep(attribute))
const clear = (draft: any[]) => []

export const AgentRestrictionSection: React.FC<AgentRestrictionSectionProps> = (
  props
) => {
  let {
    agentRestrictions: restrictions,
    updateAgentRestrictions: updateRestrictions,
    validRestrictions,
  } = props

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MenuButton
            options={validRestrictions}
            onSelectOption={(i) =>
              updateRestrictions(add(validRestrictions[i]))
            }
          >
            Add
          </MenuButton>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button onClick={() => updateRestrictions(clear)}>Clear</Button>
        </Grid>
      </Grid>
    </>
  )
}

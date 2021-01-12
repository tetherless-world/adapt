import { useImmer, Updater } from 'use-immer'
import { Button, Grid } from '@material-ui/core'
import { MenuButton } from '../../components/MenuButton'
import { BuilderSection } from './common'

export interface AgentRestrictionSectionProps {
  agentRestrictions: any[]
  updateAgentRestrictions: Updater<any[]>
}

const clear = (draft: any[]) => []

export const AgentRestrictionSection: React.FC<AgentRestrictionSectionProps> = (
  props
) => {
  let { agentRestrictions, updateAgentRestrictions } = props

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MenuButton options={[]} onSelectOption={(i) => {}}>
            Add
          </MenuButton>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button onClick={() => updateAgentRestrictions(clear)}>Clear</Button>
        </Grid>
      </Grid>
    </>
  )
}

import { Button, Grid } from '@material-ui/core'
import { Updater } from 'use-immer'
import { MenuButton } from '../../components/MenuButton'

export interface ActivityRestrictionSectionProps {
  activityRestrictions: any[],
  updateActivityRestrictions: Updater<any[]>
}

export const ActivityRestrictionSection: React.FC<ActivityRestrictionSectionProps> = (
  props
) => {
  let [
    activityRestrictions,
    updateActivityRestrictions,
  ] = props.activityRestrictions

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <MenuButton options={[]} onSelectOption={(i) => {}}>
            Add
          </MenuButton>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button>Clear</Button>
        </Grid>
      </Grid>
    </>
  )
}

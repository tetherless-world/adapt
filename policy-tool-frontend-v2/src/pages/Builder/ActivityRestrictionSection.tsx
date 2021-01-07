import { Button, Grid } from '@material-ui/core'
import { MenuButton } from '../../components/MenuButton'
import { BuilderSection } from './common'

export const ActivityRestrictionSection: React.FC<BuilderSection> = ({
  policy,
}) => {
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

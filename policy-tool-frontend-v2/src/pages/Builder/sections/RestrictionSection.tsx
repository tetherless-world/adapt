import { Button, Grid, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { MenuButton, RestrictionComponent } from 'src/components'
import { Restriction } from 'src/global'

export interface RestrictionSectionProps {
  restrictions: Restriction[]
  updateRestrictions: React.Dispatch<React.SetStateAction<Restriction[]>>
  validRestrictions: Restriction[]
}

const add = (r: Restriction) => (prev: Restriction[]): Restriction[] => {
  return [...prev, r]
}
const clear = (prev: Restriction[]): Restriction[] => []
const remove = (index: number) => (prev: Restriction[]): Restriction[] =>
  prev.filter((v, i) => i !== index)

export const RestrictionSection: React.FC<RestrictionSectionProps> = (
  props
) => {
  let { restrictions, updateRestrictions, validRestrictions } = props

  return (
    <>
      <Grid container item spacing={2}>
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
        <Grid container item spacing={1}>
          {restrictions.map((r, i) => (
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <IconButton onClick={() => updateRestrictions(remove(i))}>
                  <Delete />
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <RestrictionComponent
                  keys={[i]}
                  restrictions={restrictions}
                  updateRestrictions={updateRestrictions}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

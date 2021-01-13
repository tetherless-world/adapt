import { Button, Grid } from '@material-ui/core'
import { Draft } from 'immer'
import _ from 'lodash'
import { Updater } from 'use-immer'
import { MenuButton } from '../../components/MenuButton'
import { RestrictionComponent } from '../../components/RestrictionComponent'
import { Restriction } from '../../global'

export interface RestrictionSectionProps {
  restrictions: Restriction[]
  updateRestrictions: Updater<Restriction[]>
  validRestrictions: Restriction[]
}

const add = (attribute: Restriction) => (draft: Draft<Restriction[]>) =>
  void draft.push(_.cloneDeep(attribute))
const clear = (draft: any[]) => []

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
            <Grid container item xs={12}>
              <RestrictionComponent
                keys={[i]}
                restrictions={restrictions}
                updateRestrictions={updateRestrictions}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

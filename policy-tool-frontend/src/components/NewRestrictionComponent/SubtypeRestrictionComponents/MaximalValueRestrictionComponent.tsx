import { Grid, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext } from 'src/contexts'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import { MaximalValueRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'
import { typeMap } from './common'
import { UnitRestrictionComponent } from './UnitRestrictionComponent'

export const MaximalValueRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const labelByURI = useContext(LabelByURIContext)

  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, MaximalValueRestriction>(
    (state) => _.get(state, keys)
  )

  const baseClass = restriction['owl:someValuesFrom']['owl:intersectionOf'][0]
  const hasValueRestriction =
    restriction['owl:someValuesFrom']['owl:intersectionOf'][1]

  const unitRestriction =
    restriction['owl:someValuesFrom']['owl:intersectionOf'][3] ?? undefined

  const baseLabel = labelByURI[baseClass['@id'] ?? '']

  const { '@value': value, '@type': type } = hasValueRestriction[
    'owl:someValuesFrom'
  ]['owl:withRestrictions'][0]['xsd:maxInclusive']

  return (
    <Grid container item xs={12}>
      <Grid item xs={12} md={6}>
        <TextField
          label={baseLabel}
          value={value}
          type={typeMap[type]}
          onChange={(e) =>
            dispatch(
              actions.update(
                [
                  ...keys,
                  'owl:someValuesFrom',
                  'owl:intersectionOf',
                  1,
                  'owl:someValuesFrom',
                  'owl:withRestrictions',
                  0,
                  'xsd:maxInclusive',
                ],
                e.target.value
              )
            )
          }
        />
      </Grid>
      {!!unitRestriction && (
        <Grid item xs={12} md={6}>
          <UnitRestrictionComponent
            keys={[...keys, 'owl:someValuesFrom', 'owl:intersectionOf', 2]}
          />
        </Grid>
      )}
    </Grid>
  )
}

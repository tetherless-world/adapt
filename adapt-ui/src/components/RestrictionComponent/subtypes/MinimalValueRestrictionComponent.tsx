import { Grid, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext } from 'src/contexts'
import { OWL, XSD } from 'src/namespaces'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import { MinimalValueRestriction } from 'src/types/restrictions'
import { RestrictionProps } from '../props'
import { typeMap } from './common'
import { UnitRestrictionComponent } from './UnitRestrictionComponent'

export const MinimalValueRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const labelByURI = useContext(LabelByURIContext)

  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, MinimalValueRestriction>(
    (state) => _.get(state, keys)
  )

  const [baseClass, hasValueRest, unitRest] = restriction[OWL.someValuesFrom][
    OWL.intersectionOf
  ]

  const baseLabel = labelByURI[baseClass['@id'] ?? '']

  const { '@value': value, '@type': type } = hasValueRest[OWL.someValuesFrom][
    OWL.withRestrictions
  ][0][XSD.minInclusive]

  return (
    <Grid container item xs={12} spacing={1}>
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
                  OWL.someValuesFrom,
                  OWL.intersectionOf,
                  1,
                  OWL.someValuesFrom,
                  OWL.withRestrictions,
                  0,
                  XSD.minInclusive,
                  '@value'
                ],
                e.target.value
              )
            )
          }
        />
      </Grid>
      {!!unitRest && (
        <Grid item xs={12} md={6}>
          <UnitRestrictionComponent
            keys={[...keys, OWL.someValuesFrom, OWL.intersectionOf, 2]}
          />
        </Grid>
      )}
    </Grid>
  )
}

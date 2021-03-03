import { Grid, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext } from 'src/contexts'
import { OWL, XSD } from 'src/namespaces'
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

  const [baseClass, hasValueRest, unitRest] = restriction[OWL.someValuesFrom][
    OWL.intersectionOf
  ]

  const baseLabel = labelByURI[baseClass['@id'] ?? '']

  const { '@value': value, '@type': type } = hasValueRest[OWL.someValuesFrom][
    OWL.withRestrictions
  ][0][XSD.maxInclusive]

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
                  XSD.maxInclusive,
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

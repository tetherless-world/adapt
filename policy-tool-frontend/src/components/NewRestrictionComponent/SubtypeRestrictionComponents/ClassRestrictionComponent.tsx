import { Grid, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Selector } from 'src/components/Selector'
import { LabelByURIContext, SubclassesByURIContext } from 'src/contexts'
import { OWL } from 'src/namespaces'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import {
  ClassRestriction,
  isIntersectionClass,
  isNamedNode,
} from 'src/types/restrictions'
import { RestrictionProps } from '../props'

export const ClassRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const labelByURI = useContext(LabelByURIContext)
  const subclassesByURI = useContext(SubclassesByURIContext)

  const dispatch = useDispatch()

  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )

  if (isNamedNode(restriction[OWL.someValuesFrom])) {
    if (!!restriction[OWL.someValuesFrom]['@id'])
      // render as disabled input field
      return (
        <Grid container item xs={12}>
          <TextField
            label={'Class'}
            value={labelByURI[restriction[OWL.someValuesFrom]['@id']]}
            disabled
          />
        </Grid>
      )
  }

  if (isIntersectionClass(restriction[OWL.someValuesFrom])) {
    const baseClass = restriction[OWL.someValuesFrom][OWL.intersectionOf][0]
    const valueClass = restriction[OWL.someValuesFrom][OWL.intersectionOf][1]

    let baseURI = baseClass['@id'] ?? ''
    let baseLabel = labelByURI[baseURI]
    let valueURI = valueClass['@id'] ?? ''
    let valueLabel = labelByURI[valueURI]

    const subclasses = subclassesByURI[baseURI].map((s) => s)
    const options = subclasses.map((value) => {
      let label = labelByURI[value]
      return { label, value }
    })

    // render as selector using first named node as label
    return (
      <>
        <Grid container item xs={12}>
          <Selector
            options={options}
            textFieldProps={{
              label: baseLabel,
              value: valueLabel,
              onChange: (e) => {
                dispatch(
                  actions.update(
                    [...keys, OWL.someValuesFrom, OWL.intersectionOf, 1, '@id'],
                    e.target.value
                  )
                )
              },
            }}
          />
        </Grid>
      </>
    )
  }

  return null
}

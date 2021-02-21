import { Grid, MenuItem, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext, SubclassesByURIContext } from 'src/contexts'
import { OWL } from 'src/namespaces'
import { actions } from 'src/store'
import { NamedNode } from 'src/types/base'
import { PolicyState } from 'src/types/policy'
import {
  ClassRestriction,
  IntersectionOf,
  isIntersectionOf,
  isNamedNode,
} from 'src/types/restrictions'
import { RestrictionProps } from '../props'

const ClassRestrictionComponentA: React.FC<RestrictionProps> = ({ keys }) => {
  const labelByURI = useContext(LabelByURIContext)
  const restriction = useSelector<
    PolicyState,
    ClassRestriction & { [OWL.someValuesFrom]: NamedNode }
  >((state) => _.get(state, keys))

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

const ClassRestrictionComponentB: React.FC<RestrictionProps> = ({ keys }) => {
  const labelByURI = useContext(LabelByURIContext)
  const subclassesByURI = useContext(SubclassesByURIContext)

  const dispatch = useDispatch()
  const restriction = useSelector<
    PolicyState,
    ClassRestriction & {
      [OWL.someValuesFrom]: IntersectionOf & {
        [OWL.intersectionOf]: [NamedNode, NamedNode]
      }
    }
  >((state) => _.get(state, keys))

  const baseClass = restriction[OWL.someValuesFrom][OWL.intersectionOf][0]
  const valueClass = restriction[OWL.someValuesFrom][OWL.intersectionOf][1]

  let baseURI = baseClass['@id']
  let valueURI = valueClass['@id']
  let baseLabel = labelByURI[baseURI]

  const subclasses = subclassesByURI[baseURI].map((s) => s)
  const options = subclasses.map((uri) => ({
    label: labelByURI[uri],
    value: uri,
  }))

  // render as selector using first named node as label
  return (
    <Grid container item xs={12}>
      <TextField
        select
        label={baseLabel}
        value={valueURI}
        onChange={(e) =>
          dispatch(
            actions.update(
              [...keys, OWL.someValuesFrom, OWL.intersectionOf, 1, '@id'],
              e.target.value
            )
          )
        }
      >
        {!!options.length &&
          options.map(({ label, value }, i) => (
            <MenuItem key={i} value={value}>
              {label}
            </MenuItem>
          ))}
      </TextField>
    </Grid>
  )
}

export const ClassRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )
  let range = restriction['http://www.w3.org/2002/07/owl#someValuesFrom']

  if (isNamedNode(range)) return <ClassRestrictionComponentA keys={keys} />

  if (isIntersectionOf(range)) return <ClassRestrictionComponentB keys={keys} />

  return null
}

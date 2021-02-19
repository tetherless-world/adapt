import { MenuItem, TextField } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext, SubclassesByURIContext } from 'src/contexts'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import {
  isIntersectionClass,
  isNamedNode,
  UnitRestriction,
} from 'src/types/restrictions'
import { RestrictionProps } from '../props'

// const DisabledUnitRestrictionComponent: React.FC<RestrictionProps> = ({
//   keys,
// }) => {
//   const labelByURI = useContext(LabelByURIContext)
//   const node = useSelector<PolicyState, NamedNode>((state) =>
//     _.get(state, keys)
//   )

//   return (
//     <>
//       <TextField select disabled label={'Unit'} value={node['@id']}>
//         <MenuItem value={node['@id'] ?? ''}>
//           {labelByURI[node['@id'] ?? '']}
//         </MenuItem>
//       </TextField>
//     </>
//   )
// }

// const SelectableUnitRestrictionComponent: React.FC<RestrictionProps> = ({
//   keys,
// }) => {
//   const labelByURI = useContext(LabelByURIContext)
//   const root = useSelector<PolicyState, IntersectionClass>((state) =>
//     _.get(state, keys)
//   )

//   const [baseNode, valueNode] = root['owl:intersectionOf']

//   return <></>
// }

export const UnitRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const labelByURI = useContext(LabelByURIContext)
  const subclassesByURI = useContext(SubclassesByURIContext)

  const dispatch = useDispatch()

  const restriction = useSelector<PolicyState, UnitRestriction>((state) =>
    _.get(state, keys)
  )

  if (isNamedNode(restriction['owl:someValuesFrom'])) {
    if (!!restriction['owl:someValuesFrom']['@id'])
      // render as disabled input field
      return (
        <>
          <TextField
            label={'Class'}
            value={labelByURI[restriction['owl:someValuesFrom']['@id']]}
            disabled
          />
        </>
      )
  }

  if (isIntersectionClass(restriction['owl:someValuesFrom'])) {
    const baseClass = restriction['owl:someValuesFrom']['owl:intersectionOf'][0]
    const valueClass =
      restriction['owl:someValuesFrom']['owl:intersectionOf'][1]

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
        <TextField
          label={baseLabel}
          select
          value={valueLabel}
          onChange={(e) => {
            dispatch(
              actions.update(
                [...keys, 'owl:someValuesFrom', 'owl:intersectionOf', 1, '@id'],
                e.target.value
              )
            )
          }}
        >
          {options.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </>
    )
  }

  return null
}

import { TextField } from '@material-ui/core'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { OWL, PROV, XSD } from 'src/namespaces'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import {
  EndTimeRestriction,
  StartTimeRestriction,
  ValidityRestriction,
} from 'src/types/restrictions'
import { RestrictionProps } from '../props'
import { typeMap } from './common'

const StartTimeRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, StartTimeRestriction>((state) =>
    _.get(state, keys)
  )

  let literal =
    restriction[OWL.someValuesFrom][OWL.withRestrictions][0][XSD.minInclusive]
  const { '@value': value, '@type': type } = literal

  return (
    <>
      <TextField
        InputLabelProps={{ shrink: true }}
        label={'Start Time'}
        helperText={'Time zone is assumed to be UTC'}
        value={(value as string).slice(0, -1)}
        type={typeMap[type]}
        onChange={(e) => {
          dispatch(
            actions.update(
              [
                ...keys,
                OWL.someValuesFrom,
                OWL.withRestrictions,
                0,
                XSD.minInclusive,
                '@value',
              ],
              e.target.value + 'Z'
            )
          )
        }}
      />
    </>
  )
}
const EndTimeRestrictionComponent: React.FC<RestrictionProps> = ({ keys }) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, EndTimeRestriction>((state) =>
    _.get(state, keys)
  )

  let literal =
    restriction[OWL.someValuesFrom][OWL.withRestrictions][0][XSD.maxInclusive]
  const { '@value': value, '@type': type } = literal

  return (
    <>
      <TextField
        InputLabelProps={{ shrink: true }}
        label={'End Time'}
        helperText={'Time zone is assumed to be UTC'}
        value={(value as string).slice(0, -1)}
        type={typeMap[type]}
        onChange={(e) => {
          dispatch(
            actions.update(
              [
                ...keys,
                OWL.someValuesFrom,
                OWL.withRestrictions,
                0,
                XSD.maxInclusive,
                '@value',
              ],
              e.target.value + 'Z'
            )
          )
        }}
      />
    </>
  )
}

export const ValidityRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const restriction = useSelector<PolicyState, ValidityRestriction>((state) =>
    _.get(state, keys)
  )

  if (restriction[OWL.onProperty]['@id'] === PROV.startedAtTime)
    return <StartTimeRestrictionComponent keys={keys} />
  if (restriction[OWL.onProperty]['@id'] === PROV.endedAtTime)
    return <EndTimeRestrictionComponent keys={keys} />

  return <></>
}

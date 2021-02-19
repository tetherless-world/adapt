import { Grid, makeStyles, TextField, Typography } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext } from 'src/contexts'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import {
  IntervalRestriction,
  MaximalValueRestriction,
  MinimalValueRestriction,
} from 'src/types/restrictions'
import { RestrictionProps } from '../props'
import { typeMap } from './common'
import { UnitRestrictionComponent } from './UnitRestrictionComponent'

const useStyles = makeStyles((theme) => ({
  label: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  child: {
    paddingLeft: theme.spacing(2),
  },
}))

const getMinimalValueLiteral = (minValue: MinimalValueRestriction) => {
  return minValue['owl:someValuesFrom']['owl:intersectionOf'][1][
    'owl:someValuesFrom'
  ]['owl:withRestrictions'][0]['xsd:minInclusive']
}

const getMaximalValueLiteral = (maxValue: MaximalValueRestriction) => {
  return maxValue['owl:someValuesFrom']['owl:intersectionOf'][1][
    'owl:someValuesFrom'
  ]['owl:withRestrictions'][0]['xsd:maxInclusive']
}

export const IntervalRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const classes = useStyles()
  const labelByURI = useContext(LabelByURIContext)

  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, IntervalRestriction>((state) =>
    _.get(state, keys)
  )

  const baseNode = restriction['owl:someValuesFrom']['owl:intersectionOf'][0]

  const minValue = restriction['owl:someValuesFrom']['owl:intersectionOf'][1]
  const minUnit = minValue['owl:someValuesFrom']['owl:intersectionOf'][2] ?? ''

  const maxValue = restriction['owl:someValuesFrom']['owl:intersectionOf'][2]
  const maxUnit = maxValue['owl:someValuesFrom']['owl:intersectionOf'][2] ?? ''

  const minLiteral = getMinimalValueLiteral(minValue)
  const maxLiteral = getMaximalValueLiteral(maxValue)

  const baseLabel = labelByURI[baseNode['@id'] ?? '']
  const minLabel =
    labelByURI[
      minValue['owl:someValuesFrom']['owl:intersectionOf'][0]['@id'] ?? ''
    ]
  const maxLabel =
    labelByURI[
      maxValue['owl:someValuesFrom']['owl:intersectionOf'][0]['@id'] ?? ''
    ]

  const checkUpdateMinValueValidity = (newValue: any) => {
    if (maxLiteral['@value'] !== null && newValue > maxLiteral['@value']) return

    dispatch(
      actions.update(
        [
          ...keys,
          'owl:someValuesFrom',
          'owl:intersectionOf',
          1,
          'owl:someValuesFrom',
          'owl:intersectionOf',
          'owl:withRestrictions',
          0,
          'xsd:minInclusive',
        ],
        newValue
      )
    )
  }

  const checkUpdateMaxValueValidity = (newValue: any) => {
    if (!!minLiteral['@value'] && newValue < minLiteral['@value']) return

    dispatch(
      actions.update(
        [
          ...keys,
          'owl:someValuesFrom',
          'owl:intersectionOf',
          1,
          'owl:someValuesFrom',
          'owl:intersectionOf',
          'owl:withRestrictions',
          0,
          'xsd:maxInclusive',
        ],
        newValue
      )
    )
  }

  return (
    <>
      <Grid container item xs={12}>
        {!!baseNode['@id'] && (
          <Grid item xs={12}>
            <Typography className={classes.label}>{baseLabel}</Typography>
          </Grid>
        )}
        <Grid container item xs={12} className={classes.child}>
          <Grid item xs={12} md={6}>
            <TextField
              label={minLabel}
              value={minLiteral['@value']}
              type={typeMap[minLiteral['@type']]}
              onChange={(e) => checkUpdateMinValueValidity(e.target.value)}
            />
          </Grid>
          {!!minUnit && (
            <Grid item xs={12} md={6}>
              <UnitRestrictionComponent
                keys={[
                  ...keys,
                  'owl:someValuesFrom',
                  'owl:intersectionOf',
                  1,
                  'owl:someValuesFrom',
                  'owl:intersectionOf',
                ]}
              />
            </Grid>
          )}
        </Grid>
        <Grid container item xs={12} className={classes.child}>
          <Grid item xs={12} md={6}>
            <TextField
              label={maxLabel}
              value={maxLiteral['@value']}
              type={typeMap[maxLiteral['@type']]}
              onChange={(e) => checkUpdateMaxValueValidity(e.target.value)}
            />
          </Grid>
          {!!maxUnit && (
            <Grid item xs={12} md={6}>
              <UnitRestrictionComponent
                keys={[
                  ...keys,
                  'owl:someValuesFrom',
                  'owl:intersectionOf',
                  2,
                  'owl:someValuesFrom',
                  'owl:intersectionOf',
                ]}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  )
}

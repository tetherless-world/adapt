import { Grid, makeStyles, TextField, Typography, useTheme } from '@material-ui/core'
import _ from 'lodash'
import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LabelByURIContext } from 'src/contexts'
import { OWL, XSD } from 'src/namespaces'
import { actions } from 'src/store'
import { Literal } from 'src/types/base'
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
    paddingBottom: theme.spacing(2),
  },
}))

const getMinimalValueLiteral = (minValue: MinimalValueRestriction): Literal => {
  return minValue[OWL.someValuesFrom][OWL.intersectionOf][1][
    OWL.someValuesFrom
  ][OWL.withRestrictions][0][XSD.minInclusive]
}

const getMaximalValueLiteral = (maxValue: MaximalValueRestriction): Literal => {
  return maxValue[OWL.someValuesFrom][OWL.intersectionOf][1][
    OWL.someValuesFrom
  ][OWL.withRestrictions][0][XSD.maxInclusive]
}

export const IntervalRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const labelByURI = useContext(LabelByURIContext)

  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, IntervalRestriction>((state) =>
    _.get(state, keys)
  )

  const baseNode = restriction[OWL.someValuesFrom][OWL.intersectionOf][0]

  const minValR = restriction[OWL.someValuesFrom][OWL.intersectionOf][1]
  const minUnit = minValR[OWL.someValuesFrom][OWL.intersectionOf][2] ?? ''

  const maxValR = restriction[OWL.someValuesFrom][OWL.intersectionOf][2]
  const maxUnit = maxValR[OWL.someValuesFrom][OWL.intersectionOf][2] ?? ''

  const { '@type': minType, '@value': minVal } = getMinimalValueLiteral(minValR)
  const { '@type': maxType, '@value': maxVal } = getMaximalValueLiteral(maxValR)

  const baseLabel = labelByURI[baseNode['@id']]
  const minLabel =
    labelByURI[minValR[OWL.someValuesFrom][OWL.intersectionOf][0]['@id']]
  const maxLabel =
    labelByURI[maxValR[OWL.someValuesFrom][OWL.intersectionOf][0]['@id']]

  const checkUpdateMinValueValidity = (newValue: any) => {
    if (!!maxVal && newValue > maxVal) return

    dispatch(
      actions.update(
        [
          ...keys,
          OWL.someValuesFrom,
          OWL.intersectionOf,
          1,
          OWL.someValuesFrom,
          OWL.intersectionOf,
          OWL.withRestrictions,
          0,
          XSD.minInclusive,
          '@value',
        ],
        newValue
      )
    )
  }

  const checkUpdateMaxValueValidity = (newValue: any) => {
    if (!!minVal && newValue < minVal)
      dispatch(
        actions.update(
          [
            ...keys,
            OWL.someValuesFrom,
            OWL.intersectionOf,
            2,
            OWL.someValuesFrom,
            OWL.intersectionOf,
            OWL.withRestrictions,
            0,
            XSD.maxInclusive,
            '@value',
          ],
          minVal
        )
      )

    dispatch(
      actions.update(
        [
          ...keys,
          OWL.someValuesFrom,
          OWL.intersectionOf,
          2,
          OWL.someValuesFrom,
          OWL.intersectionOf,
          OWL.withRestrictions,
          0,
          XSD.maxInclusive,
          '@value',
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
              value={minVal}
              type={typeMap[minType]}
              onChange={(e) => checkUpdateMinValueValidity(e.target.value)}
            />
          </Grid>
          {!!minUnit && (
            <Grid item xs={12} md={6}>
              <UnitRestrictionComponent
                keys={[
                  ...keys,
                  OWL.someValuesFrom,
                  OWL.intersectionOf,
                  1,
                  OWL.someValuesFrom,
                  OWL.intersectionOf,
                ]}
              />
            </Grid>
          )}
        </Grid>
        <Grid container item xs={12} className={classes.child}>
          <Grid item xs={12} md={6}>
            <TextField
              label={maxLabel}
              value={maxVal}
              type={typeMap[maxType]}
              onChange={(e) => checkUpdateMaxValueValidity(e.target.value)}
            />
          </Grid>
          {!!maxUnit && (
            <Grid item xs={12} md={6}>
              <UnitRestrictionComponent
                keys={[
                  ...keys,
                  OWL.someValuesFrom,
                  OWL.intersectionOf,
                  2,
                  OWL.someValuesFrom,
                  OWL.intersectionOf,
                ]}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  )
}

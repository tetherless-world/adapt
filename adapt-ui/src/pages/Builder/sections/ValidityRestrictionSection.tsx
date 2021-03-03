import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuButton } from 'src/components'
import { RestrictionComponent } from 'src/components/'
import { OWL, PROV, RDFS, XSD } from 'src/namespaces'
import { actions, selectRestrictions } from 'src/store'
import {
  EndTimeRestriction,
  isValidityRestriction,
  StartTimeRestriction,
  ValidityRestriction,
} from 'src/types/restrictions'
import { useRestrictionSectionStyles } from './common'

const defaultValidityRestrictions: Record<string, ValidityRestriction> = {
  'Start Time': {
    '@type': OWL.Restriction,
    [OWL.onProperty]: { '@id': PROV.startedAtTime },
    [OWL.someValuesFrom]: {
      '@type': RDFS.Datatype,
      [OWL.onDatatype]: { '@id': XSD.dateTime },
      [OWL.withRestrictions]: [
        { [XSD.minInclusive]: { '@type': XSD.dateTime, '@value': '' } },
      ],
    },
  } as StartTimeRestriction,
  'End Time': {
    '@type': OWL.Restriction,
    [OWL.onProperty]: { '@id': PROV.endedAtTime },
    [OWL.someValuesFrom]: {
      '@type': RDFS.Datatype,
      [OWL.onDatatype]: { '@id': XSD.dateTime },
      [OWL.withRestrictions]: [
        { [XSD.maxInclusive]: { '@type': XSD.dateTime, '@value': '' } },
      ],
    },
  } as EndTimeRestriction,
}

export const ValidityRestrictionSection: React.FC = () => {
  const classes = useRestrictionSectionStyles()

  const dispatch = useDispatch()

  const restrictions = useSelector(selectRestrictions)

  const iMin = useMemo(() => {
    let [a, ...rest] = restrictions
    let iMin = rest.findIndex(isValidityRestriction)
    if (iMin === -1) return -1
    return iMin + 1
  }, [restrictions])
  const validityRestrictions = useMemo(() => {
    if (iMin === -1) return []
    return restrictions.slice(iMin)
  }, [restrictions, iMin])

  const validRestrictions = defaultValidityRestrictions
  const restrictionLabels = Object.keys(validRestrictions)
  const restrictionOptions = restrictionLabels.map((label) => ({ label }))

  const handleSelectOption = (i: number) => {
    console.log(i)
    let label = restrictionLabels[i]
    let restriction = _.cloneDeep(validRestrictions[label])
    let action = actions.addValidityRestriction(restriction)
    dispatch(action)
  }

  const handleResetValidityRestrictions = () => {
    dispatch(actions.resetValidityRestrictions())
  }

  const handleDeleteValidityRestriction = (i: number) => () => {
    dispatch(actions.deleteValidityRestriction(i))
  }

  return (
    <>
      <Grid container>
        <Grid container item className={classes.header}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={1}>
              <Typography variant={'h6'}>Validity</Typography>
            </Grid>
            <Grid item xs={12} md={'auto'}>
              <MenuButton
                options={restrictionOptions}
                onSelectOption={handleSelectOption}
                buttonProps={{ children: 'Add' }}
              />
            </Grid>
            <Grid item xs={12} md={'auto'}>
              <Button onClick={handleResetValidityRestrictions}>Reset</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item spacing={2}>
          {validityRestrictions.map((r, i) => (
            <Grid
              container
              item
              key={i}
              xs={8}
              alignItems={'flex-start'}
              className={classes.restrictions}
            >
              <Grid item xs={1}>
                <IconButton onClick={handleDeleteValidityRestriction(i)}>
                  <Delete />
                </IconButton>
              </Grid>
              <Grid item xs={11}>
                <RestrictionComponent
                  keys={[OWL.equivalentClass, OWL.intersectionOf, iMin + i]}
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  )
}

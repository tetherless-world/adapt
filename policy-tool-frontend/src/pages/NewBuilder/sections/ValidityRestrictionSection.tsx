import { Button, Grid, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import _ from 'lodash'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MenuButton } from 'src/components'
import { RestrictionComponent } from 'src/components/'
import { OWL, PROV, RDFS, XSD } from 'src/namespaces'
import { actions, selectRestrictions } from 'src/store'
import { NamedNode } from 'src/types/base'
import { PolicyState } from 'src/types/policy'
import {
  AgentRestriction,
  EndTimeRestriction,
  isValidityRestriction,
  StartTimeRestriction,
  ValidityRestriction,
} from 'src/types/restrictions'

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
  }, [restrictions])

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
      <Grid container item spacing={2}>
        <Grid item xs={12} md={4}>
          <MenuButton
            options={restrictionOptions}
            onSelectOption={handleSelectOption}
            buttonProps={{ children: 'Add' }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button onClick={handleResetValidityRestrictions}>Reset</Button>
        </Grid>
        <Grid container item spacing={2}>
          {validityRestrictions.map((r, i) => {
            return (
              <Grid
                container
                item
                xs={12}
                spacing={1}
                alignItems={'flex-start'}
                key={i}
              >
                <Grid item>
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
            )
          })}
        </Grid>
      </Grid>
    </>
  )
}

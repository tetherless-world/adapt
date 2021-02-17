import { Grid, makeStyles } from '@material-ui/core'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Option } from 'src/global'
import { actions } from 'src/store'
import { PolicyState } from 'src/types/policy'
import {
  AgentRestriction,
  BaseAttributeRestriction,
  BaseValueRestriction,
  ClassRestriction,
  isAgentRestriction,
  isAttributeRestriction,
  isBaseAttributeRestriction,
  isBaseValueRestriction,
  isBoundedValueRestriction,
  isClassRestriction,
  isIntervalRestriction,
  isMaximalValueRestriction,
  isMinimalValueRestriction,
  isNamedNode,
  isValueRestriction,
  RestrictionNode,
} from 'src/types/restrictions'
import { Selector } from '../Selector'

const useStyles = makeStyles((theme) => {
  return {
    root: {
      marginLeft: theme.spacing(2),
    },
    label: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
  }
})

export interface RestrictionProps {
  keys: (string | number)[]
}

const AgentRestrictionComponent: React.FC<RestrictionProps> = ({ keys }) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, AgentRestriction>((state) =>
    _.get(state, keys)
  )

  // TODO: retrieve from AgentsContext
  let options: Option[] = [{ label: '', value: '' }]
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Selector
          options={options}
          textFieldProps={{
            label: 'Agent',
            onChange: (e) =>
              dispatch(actions.update([...keys, '@id'], e.target.value)),
          }}
        />
      </Grid>
    </Grid>
  )
}

const ClassRestrictionComponentA: React.FC<RestrictionProps> = ({ keys }) => {
  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )
  return <></>
}

const ClassRestrictionComponentB: React.FC<RestrictionProps> = ({ keys }) => {
  const restriction = useSelector<PolicyState, ClassRestriction>((state) =>
    _.get(state, keys)
  )
  return <></>
}

const BaseAttributeRestrictionComponent: React.FC<RestrictionProps> = ({
  keys,
}) => {
  const dispatch = useDispatch()
  const restriction = useSelector<PolicyState, BaseAttributeRestriction>(
    (state) => _.get(state, keys)
  )

  return <></>
}

export const RestrictionComponent: React.FC<RestrictionProps> = ({ keys }) => {
  const restriction = useSelector<PolicyState, RestrictionNode>((state) =>
    _.get(state, keys)
  )

  if (!restriction) return null

  if (isAgentRestriction(restriction)) {
    if (isNamedNode(restriction['owl:someValuesFrom'])) {
      return <AgentRestrictionComponent keys={keys} />
    } else {
      return <RestrictionComponent keys={[...keys, 'owl:someValuesFrom']} />
    }
  } else if (isBaseAttributeRestriction(restriction)) {
    if (isClassRestriction(restriction)) {
      if (isNamedNode(restriction['owl:someValuesFrom'])) {
        // render as disabled selector
        return <ClassRestrictionComponentA keys={keys} />
      } else {
        // render as selector using first named node as label
        return <ClassRestrictionComponentB keys={keys} />
      }
    }

    if (isBaseValueRestriction(restriction)) {
      let children = [<></>]
      if (isValueRestriction(restriction)) {
        // simple input for the restriction
        children = [...children, <></>]
      }

      if (isBoundedValueRestriction(restriction)) {
        if (isMinimalValueRestriction(restriction)) {
          // simple input for the restriction
          children = [...children, <></>]
        }
        if (isMaximalValueRestriction(restriction)) {
          // simple input for the restriction
          children = [...children, <></>]
        }
      }

      if (!!restriction['owl:someValuesFrom']['owl:intersectionOf'][2]) {
        // unit restriction
        children = [...children, <></>]
      }
    }

    if (isAttributeRestriction(restriction)) {
      if (isIntervalRestriction(restriction)) {
        // render range attribute, ensuring no invalid inputs
        return <></>
      }
      // map and render children attributes
      return <></>
    }
  }

  return null
}

// return (
//   <div className={classes.root}>
//     {/* {
//       <Grid container spacing={1}>
//         <Grid item xs={12}>
//           <Typography className={classes.label}>
//             {restriction.label}
//           </Typography>
//         </Grid>
//         {restriction.restrictions.map((_, i) => (
//           <Grid item xs={12} key={i}>
//             <RestrictionComponent
//               keys={[...keys, 'restrictions', i]}
//               restrictions={restrictions}
//               updateRestrictions={updateRestrictions}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     }
//     {!!restriction?.values?.length &&
//       restriction.values.map(({ value, type }, i) => (
//         <Grid container item xs={12} md={6} key={i}>
//           <InputWrapper
//             typeUri={type}
//             options={options}
//             textFieldProps={{
//               label: restriction.label,
//               value: value ?? '',
//               onChange: (event: any) =>
//                 updateRestrictions(
//                   updateValue(
//                     [...keys, 'values', i, 'value'],
//                     event?.target?.value
//                   )
//                 ),
//             }}
//           />
//         </Grid>
//       ))} */}
//   </div>
// )

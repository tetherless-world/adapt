import { Grid, makeStyles, Typography, useTheme } from '@material-ui/core'
import { ErrorRounded } from '@material-ui/icons'
import _, { Dictionary, update } from 'lodash'
import { PropertyPath } from 'lodash'
import { useContext, useMemo } from 'react'
import { ListState } from '../../global'
import { InputWrapper } from '../InputWrapper'

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

const booleanOps = ['owl:intersectionOf', 'owl:unionOf']
const datatypeConstraints = ['xsd:minInclusive', 'xsd:maxInclusive']
const specifiers = ['owl:someValuesFrom', 'owl:hasValue', 'owl:allValuesFrom']

const getRestrictedProperty = (root: any) => root?.['owl:onProperty']
const getValueSpecifier = (root: any) => {
  let valueSpecifier = _.keys(root)
    .filter((k) => specifiers.includes(k))
    .pop()

  if (valueSpecifier === undefined)
    throw Error(`Object must have one key from ${specifiers}`)

  return valueSpecifier
}

const getBooleanOperation = (root: any, valueSpecifier: string) => {
  let booleanOp = _.keys(root[valueSpecifier])
    .filter((k) => booleanOps.includes(k))
    .pop()

  if (booleanOp === undefined)
    throw Error(`Object must have one key from ${booleanOps}`)

  return booleanOp
}

const getDatatypeConstraint = (datatype: any) => {
  let datatypeConstraint = _.keys(datatype['owl:withRestrictions'][0])
    .filter((k) => booleanOps.includes(k))
    .pop()

  if (datatypeConstraint === undefined)
    throw Error(`Object must have one key from ${datatypeConstraints}`)

  return datatypeConstraint
}

export interface RestrictionProps {
  keys: PropertyPath
  restrictions: [restrictions: any[], updateRestrictions: Function]
}

const AttributeRestriction: React.FC<RestrictionProps> = (props) => {
  const theme = useTheme()
  const classes = useStyles(theme)

  const keys = _.toPath(props.keys)
  const [restrictions, updateRestrictions] = props.restrictions
  const root: any = _.get(restrictions, keys)
  const valueSpecifier = getValueSpecifier(root)
  const booleanOp = getBooleanOperation(root, valueSpecifier)
  const [uri, ...rest]: [string, any[]] = _.get(root, [
    valueSpecifier,
    booleanOp,
  ])

  const _children = useMemo<JSX.Element[]>(
    () =>
      rest.map((r: any, i) => {
        let path = [...keys, valueSpecifier, booleanOp, i]
        // Todo: check if root is rdfs:subClassOf sio:Interval
        switch (r['owl:onProperty']) {
          case 'sio:hasAttribute':
            return (
              <AttributeRestriction
                keys={path}
                restrictions={[restrictions, updateRestrictions]}
              />
            )
          case 'sio:hasValue':
            const valSpec = getValueSpecifier(r)

            if (valSpec === 'owl:hasValue') {
              // TODO: handle sio:hasValue
              throw Error('sio:hasValue support not yet implemented.')
            }
            const restrictedDatatype = r[valSpec]
            const typeUri = restrictedDatatype['owl:onDatatype']

            const constraint = getDatatypeConstraint(restrictedDatatype)

            path = [...path, valSpec, 0, constraint]
            const onChange = (e: any) =>
              updateRestrictions((d: any[]) => _.set(d, path, e.target.value))

            return (
              <>
                <InputWrapper
                  typeUri={typeUri}
                  textFieldProps={{
                    value: _.get(restrictions, path),
                    onChange,
                  }}
                />
              </>
            )
          default:
            throw Error()
        }
      }),
    [root]
  )

  return (
    <Grid container item className={classes.root}>
      <Typography className={classes.label}>{uri}</Typography>
      {_children}
    </Grid>
  )
}

const ValueRestriction: React.FC<RestrictionProps> = (props) => {
  let keys = _.toPath(props.keys)
  let [restrictions, updateRestrictions] = props.restrictions

  return <></>
}

export const Restriction: React.FC<RestrictionProps> = (props) => {
  let keys = _.toPath(props.keys)
  let [restrictions, updateRestrictions] = props.restrictions

  let restrictedProperty = _.get(restrictions, [...keys, 'owl:onProperty'])

  if (typeof restrictedProperty === undefined)
    throw new Error(`No value found for 'owl:onProperty' at  ${keys}.`)

  return restrictedProperty === 'sio:hasAttribute' ? (
    <AttributeRestriction {...props} />
  ) : restrictedProperty === 'sio:hasValue' ? (
    <ValueRestriction {...props} />
  ) : (
    <div>Error: Restriction could not be rendered</div>
  )
}

import React, { useState } from 'react'
import { makeStyles, Button, Grid, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core'
// import _ from 'lodash'

const useStyles = makeStyles(theme => ({
  root: {},
  attr: {
    padding: theme.spacing(1)
  },
  formControl: {
    minWidth: 300
  },
  pre: {
    paddingTop: theme.spacing(8)
  }
}))

const ButtonProps = {
  color: 'primary',
  variant: 'outlined',
  // size: 'small'
}

export default function AttributeEditor () {
  const classes = useStyles()

  const valid_attrs = ['Frequency Range', 'Time', 'Location']

  const newValue = () => null
  const newAttribute = () => ({ values: [newValue()] })

  const [state, setState] = useState([newAttribute()])


  const addIntersection = (index) => { }

  const addUnion = (index) => {
    setState(prevState => {
      let copy = [...prevState]
      copy[index].values = [...copy[index].values, newValue()]
      return copy
    })
  }

  const UnionButton = ({ index }) => (
    <Button {...ButtonProps} onClick={() => addUnion(index)}>
      Union
    </Button>
  )

  const IntersectButton = ({ index }) => (
    <Button {...ButtonProps} onClick={() => addIntersection(index)}>
      Intersect
    </Button>
  )

  const Attribute = ({ attr, index }) => {
    return (
      <>
        <Grid container spacing={4}>
          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel id={`attr_${index}`}>
                Attribute {index}
              </InputLabel>
              <Select labelId={`attr_${index}`}>
                <MenuItem />
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Grid container direction={'column'}>
              {state[index].values.map((v, i) => (
                <Grid item>
                  <FormControl className={classes.formControl} key={`value_${index}_${i}`}>
                    <InputLabel id={`value_${index}`}>
                      Value {i}
                    </InputLabel>
                    <Select labelId={`value_${index}`}>
                      <MenuItem />
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item>
            <UnionButton index={index} />
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <Grid container spacing={1}>
        {state.map((attr, index) => (
          <Grid item xs={12}>
            <Attribute index={index} attr={attr} />
          </Grid>
        ))}
      </Grid>
      <Grid container item className={classes.pre}>
        <Grid item xs={12}>
          <Button onClick={() => setState([newAttribute()])}>Clear</Button>
        </Grid>
      </Grid>
    </>
  )
}

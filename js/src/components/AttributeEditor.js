import React, { useState } from 'react'
import { makeStyles, Button, Grid, Select, InputLabel, MenuItem, FormControl, IconButton, Typography } from '@material-ui/core'
import { Delete as DeleteIcon, Clear as ClearIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  attr: {
    // padding: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(4)
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
  size: 'small'
}

export default function AttributeEditor ({ attributes, setAttributes, validAttributes }) {
  const classes = useStyles()

  const newValue = () => null
  const newAttribute = () => ({ values: [newValue()] })

  const addIntersection = () => {
    setAttributes(prevAttrs => [...prevAttrs, newAttribute()])
  }

  const addUnion = (index) => {
    setAttributes(prevAttrs => {
      let copy = [...prevAttrs]
      copy[index].values = [...copy[index].values, newValue()]
      return copy
    })
  }

  const deleteValue = (index, valueIndex) => {
    setAttributes(prevAttrs => {
      let copy = [...prevAttrs]
      copy[index].values = copy[index].values.length === 1 ? [newValue()] : copy[index].values.filter((_, i) => i !== valueIndex)
      return copy
    })
  }

  const UnionButton = ({ index }) => (
    <Button
      onClick={() => addUnion(index)}
      {...ButtonProps}
    >
      Union
    </Button>
  )

  const IntersectButton = () => (
    <Button
      onClick={() => addIntersection()}
      {...ButtonProps}
    >
      Intersect
    </Button>
  )

  const DeleteValueButton = ({ index, valueIndex }) => (
    <IconButton
      onClick={() => deleteValue(index, valueIndex)}
      {...ButtonProps}
    >
      <ClearIcon />
    </IconButton>
  )

  const ClearButton = () => (
    <Button
      startIcon={<DeleteIcon />}
      onClick={() => setAttributes(() => [newAttribute()])}
      {...ButtonProps}
    >
      Clear All Attributes
    </Button>
  )

  const Attribute = ({ attr, index }) => {
    return (
      <>
        <Grid container spacing={1} alignItems={'flex-end'}>
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
            <UnionButton index={index} />
          </Grid>
        </Grid>
        <Grid
          container
          direction={'column'}
          className={classes.nested}
        >
          {attributes[index].values.map((v, i) => (
            <Grid
              container
              item
              spacing={2}
              alignItems={"flex-end"}
            >
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
              <Grid item>
                <DeleteValueButton index={index} valueIndex={i} />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </>
    )
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1} >
        <Grid item>
          <IntersectButton />
        </Grid>
        <Grid item>
          <ClearButton />
        </Grid>
        {attributes.map((attr, index) => (
          <Grid item xs={12}>
            <Attribute index={index} attr={attr} />
          </Grid>
        ))}
      </Grid>
      <Grid container item className={classes.pre}>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    </div>
  )
}

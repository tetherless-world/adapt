import React, { useEffect } from 'react'
import { makeStyles, Button, Grid, Select, InputLabel, MenuItem, FormControl, IconButton } from '@material-ui/core'
import { Delete as DeleteIcon, Clear as ClearIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
  },
  attr: {
    // padding: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(10)
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

const newValue = () => (null)
const newAttribute = () => ({ attr: '', values: [] })

export default function AttributeEditor ({ attributes, setAttributes, validAttributes }) {
  const classes = useStyles()

  useEffect(() => {
    setAttributes([newAttribute()])
  }, [])

  const addIntersection = () => setAttributes(prev => [...prev, newAttribute()])

  const addUnion = (index) => setAttributes(prev => {
    let copy = [...prev]
    copy[index].values.push(newValue())
    return copy
  })

  const deleteAttribute = (index) => {
    setAttributes(prev => {
      let copy = [...prev]
      copy.splice(index, 1)
      return copy
    })
  }

  const deleteValue = (index, valueIndex) => {
    setAttributes(prev => {
      let copy = [...prev]
      copy[index].values.splice(valueIndex, 1)
      return copy
    })
  }
  
  const clearAttributes = () => setAttributes([newAttribute()])

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

  const DeleteAttributeButton = ({ index }) => (
    <IconButton
      onClick={() => deleteAttribute(index)}
      {...ButtonProps}
    >
      <ClearIcon />
    </IconButton>
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
      onClick={clearAttributes}
      {...ButtonProps}
    >
      Clear All
    </Button>
  )

  const Attribute = ({ attribute, index }) => (
    <>
      <Grid container spacing={1} alignItems={'flex-end'}>
        <Grid item>
          <DeleteAttributeButton index={index}/>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id={`attr_${index}`}>
              Attribute {index}
            </InputLabel>
            <Select labelId={`attr_${index}`} value={attribute.attr}>
              {validAttributes && validAttributes.map(({ label, value }) => (
                <MenuItem value={value}>{label}</MenuItem>
              ))}
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
        {attribute.values.map((v, i) => (
          <Grid
            container
            item
            spacing={2}
            alignItems={"flex-end"}
            key={`value_${index}_${i}`}
          >
            <Grid item>
              <FormControl className={classes.formControl}>
                <InputLabel id={`value_${index}`}>
                  Value {i}
                </InputLabel>
                <Select labelId={`value_${index}`}>
                  {/* TODO: map valid value options to MenuItems  */}
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

  return (
    <div className={classes.root}>
      <Grid container spacing={1} >
        <Grid item>
          <IntersectButton />
        </Grid>
        <Grid item>
          <ClearButton />
        </Grid>
        <Grid container item xs={12}>
          {attributes.map((attribute, index) => (
            <Grid item xs={12} key={index}>
              <Attribute index={index} attribute={attribute} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  )
}

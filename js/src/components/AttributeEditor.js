import React, { useState } from 'react'
import { makeStyles, Button, Grid, Typography, Select, Box, InputLabel, MenuItem, FormControl } from '@material-ui/core'
import _ from 'lodash'

const useStyles = makeStyles(theme => ({
  root: {},
  attr: {
    padding: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(1)
  },
  pre: {
    paddingTop: theme.spacing(8)
  }
}))

export default function AttributeEditor () {
  const classes = useStyles()

  const valid_attrs = ['Frequency Range', 'Time', 'Location']

  const newAttribute = () => ({ attr: '', intersection: [] })

  const [value, setValue] = useState([newAttribute()])


  const addIntersection = keyList => {
    setValue(prevValue => {
      if (keyList && keyList.length > 0) {
        let copy = [...prevValue]
        let curr = _.get(copy, keyList)
        _.set(
          copy,
          [...keyList, 'intersection'],
          [...(curr.intersection ? curr.intersection : []), newAttribute()]
        )
        return copy
      } else {
        return [...prevValue, newAttribute()]
      }
    })
  }

  const addUnion = keyList => {
    setValue(prevValue => {
      if (keyList && keyList.length > 1) {
        let copy = [...prevValue]
        let curr = _.get(copy, keyList.slice(0, -2))
        console.log(curr.intersection)
        _.set(
          copy,
          [...keyList.slice(0, -1)],
          [...(curr.intersection ? curr.intersection : []), newAttribute()]
        )
        return copy
      } else {
        return [...prevValue, newAttribute()]
      }
    })
  }

  const ButtonProps = {
    color: 'primary',
    variant: 'outlined',
    size: 'small'
  }

  const UnionButton = ({ keyList }) => (
    <Button {...ButtonProps} onClick={() => addUnion(keyList)}>
      Union
    </Button>
  )

  const IntersectButton = ({ keyList }) => (
    <Button {...ButtonProps} onClick={() => addIntersection(keyList)}>
      Intersect
    </Button>
  )

  const Attribute = ({ keyList, data }) => {
    return (
      <>
        <Grid container spacing={1} alignItems={'center'} className={classes.attr}>
          <Grid item>
            <FormControl style={{ minWidth: 160 }}>
              <InputLabel id={[...keyList, 'attr-label'].join('-')}>
                Attribute
              </InputLabel>
              <Select
                labelId={[...keyList, 'attr-label'].join('-')}
                id={keyList.join('')} value={undefined}
              >
                <MenuItem />
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl style={{ minWidth: 160 }}>
              <InputLabel id={[...keyList, 'value-label'].join('-')}>
                Value
              </InputLabel>
              <Select
                labelId={[...keyList, 'value-label'].join('-')}
                id={keyList.join('')}
                value={undefined}
              >
                <MenuItem />
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <UnionButton keyList={keyList} />
          </Grid>
          <Grid item>
            <IntersectButton keyList={keyList} />
          </Grid>
          {data.intersection &&
            data.intersection.map((d, index) => (
              <Grid container item className={classes.nested}>
                <Attribute
                  keyList={[...keyList, 'intersection', index]}
                  data={d}
                />
              </Grid>
            ))}
        </Grid>
      </>
    )
  }

  return (
    <>
      <Grid container spacing={1}>
        <UnionButton />
        {value.map((v, index) => (
          <Attribute keyList={[index]} data={v} />
        ))}
      </Grid>
      <Grid container item className={classes.pre}>
        <Grid item xs={12}>
          <Button onClick={() => setValue([newAttribute()])}>Clear</Button>
        </Grid>
      </Grid>
    </>
  )
}

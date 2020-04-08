import React from 'react'
import { Grid, Collapse, Typography, Switch } from '@material-ui/core'
import { useToggle } from 'react-use'

export default function PreviewJson({
  title,
  data,
  titleTypographyProps = { variant: 'h5' },
  toggleable = true,
  defaultState = 'open'
}) {
  const [visible, toggle] = useToggle(defaultState === 'open')
  return (
    <>
      <Grid container spacing={4}>
        <Grid item>
          <Typography {...titleTypographyProps}>{title}</Typography>
        </Grid>
        {toggleable && (
          <Grid item>
            <Switch
              value={visible}
              checked={visible}
              onClick={toggle}
            />
          </Grid>
        )}
      </Grid>
      {toggleable ? (
        <Grid container item>
          <Collapse in={visible}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Collapse>
        </Grid>
      ) : (
        <Grid container item>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Grid>
      )}
    </>
  )
}

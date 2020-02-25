import React, { useState } from 'react'
import { Grid, Collapse, Typography, Switch } from '@material-ui/core'


export default function PreviewJson ({ title, data, titleTypographyProps = { variant: 'h5' }, toggleable = true}) {
  const [visible, setVisibility] = useState(false)
  const handleOnToggle = () => setVisibility(!visible)
  return (
    <>
      <Grid container spacing={4}>
        <Grid item>
          <Typography {...titleTypographyProps}>{title}</Typography>
        </Grid>
        {toggleable && (
          < Grid item>
            <Switch value={visible} onClick={handleOnToggle} />
          </Grid>
        )}
      </Grid>
      {toggleable ? (
        <Grid container item>
          <Collapse in={visible}>
            <pre>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Collapse>
        </Grid>
      ) : (
          <Grid container item>
            <pre>
              {JSON.stringify(data, null, 2)}
            </pre>
          </Grid>
        )}
    </>
  )
}


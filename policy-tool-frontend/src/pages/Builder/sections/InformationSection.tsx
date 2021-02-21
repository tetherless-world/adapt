import { Grid, TextField } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RDFS, SKOS } from 'src/namespaces'
import { actions, selectDefinition, selectLabel } from 'src/store'
import { PolicyState } from 'src/types/policy'
import { isValidURI } from '../helpers'

export interface InformationSectionProps {
  source: [source: string, setSource: Function]
  id: [id: any, setId: Function]
  label: [label: any, setLabel: Function]
  definition: [definition: any, setDefinition: Function]
}

const parseURI = (uri: string) => {
  let i = uri.lastIndexOf('#')
  return {
    id: uri.substr(i + 1),
    source: uri.substr(0, i),
  }
}

export const InformationSection: React.FC = () => {
  const dispatch = useDispatch()

  const uri = useSelector<PolicyState, string>((state) => state['@id'])
  const label = useSelector<PolicyState, string>(selectLabel)
  const def = useSelector<PolicyState, string>(selectDefinition)

  const { id, source } = parseURI(uri)

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} sm={6} spacing={1}>
        <Grid item xs={12}>
          <TextField
            label={'Source'}
            value={source}
            onChange={(e) => dispatch(actions.setURI(e.target.value, id))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'ID'}
            value={id}
            onChange={(e) => dispatch(actions.setURI(source, e.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'Label'}
            value={label}
            onChange={(e) => dispatch(actions.setLabel(e.target.value))}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} sm={6} spacing={1}>
        <Grid item xs={12}>
          <TextField
            label={'Definition'}
            value={def}
            required={false}
            onChange={(e) => dispatch(actions.setDefinition(e.target.value))}
            multiline
            rowsMax={10}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

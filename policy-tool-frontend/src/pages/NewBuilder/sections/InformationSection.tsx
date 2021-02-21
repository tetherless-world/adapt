import { Grid, TextField } from '@material-ui/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PolicyState } from 'src/types/policy'
import { isValidURI } from '../helpers'
import { actions } from 'src/store'
import { RDFS, SKOS } from 'src/namespaces'

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

const selectURI = (state: PolicyState) => {
  let uri = state['@id']
  return parseURI(uri)
}

export const InformationSection: React.FC = () => {
  const dispatch = useDispatch()

  const uri = useSelector<PolicyState, string>((state) => state['@id'])
  const label = useSelector<PolicyState, string>((state) => state[RDFS.label])
  const def = useSelector<PolicyState, string>(
    (state) => state[SKOS.definition]
  )

  const { id, source } = parseURI(uri)

  const [sourceBuffer, setSourceBuffer] = useState<string>(source)
  const [idBuffer, setIdBuffer] = useState<string>(id)
  const [validity, setValidity] = useState<boolean>(true)

  useEffect(() => {
    if (isValidURI(sourceBuffer, idBuffer)) {
      dispatch(actions.setURI(sourceBuffer, idBuffer))
      setValidity(true)
    } else {
      setValidity(false)
    }
  }, [sourceBuffer, idBuffer])

  return (
    <Grid container spacing={2}>
      <Grid container item xs={6} spacing={1} alignContent={'flex-start'}>
        <Grid item xs={12}>
          <TextField
            label={'Source'}
            value={sourceBuffer}
            onChange={(e) => setSourceBuffer(e.target.value)}
            error={validity}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label={'ID'}
            value={idBuffer}
            onChange={(e) => setIdBuffer(e.target.value)}
            error={validity}
            helperText={validity && 'Source/Id invalid.'}
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
      <Grid container item xs={6}>
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

import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  TextField,
} from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { FormSection } from '../components/FormSection'
import { LoadingWrapper } from '../components/LoadingWrapper'
import { MenuButton } from '../components/MenuButton'
import { usePolicy } from '../hooks/usePolicy'
import {
  RequesterRestrictionsContext,
  RequestRestrictionsContext,
} from '../contexts/RestrictionsContext'

const useStyles = makeStyles((theme) => ({
  section: {
    paddingBottom: theme.spacing(3),
  },
  subSection: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

export const Builder = () => {
  const classes = useStyles()
  const policy = usePolicy()

  return (
    <LoadingWrapper loading={false}>
      <FormSection title={'Information'} className={classes.section}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={'Source'}
              value={policy.source.get()}
              onChange={(e) => policy.source.set(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={'ID'}
              value={policy.id.get()}
              onChange={(e) => policy.id.set(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={'Label'}
              value={policy.label.get()}
              onChange={(e) => policy.label.set(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={'Definition'}
              value={policy.definition.get()}
              onChange={(e) => policy.definition.set(e.target.value)}
              multiline
            />
          </Grid>
        </Grid>
      </FormSection>
      <FormSection title={'Request Rules'} className={classes.section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MenuButton options={[]} onSelectOption={(i) => {}}>
              Add
            </MenuButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button onClick={() => policy.requestRestrictions.clear()}>
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid container item>
          {/*  */}
          <Grid container item>
            {/*  */}
            {policy.requestRestrictions.state.map((_, i) => (
              <Grid container item xs={12} alignItems={'stretch'}>
                <Grid item xs={1}>
                  <IconButton
                    onClick={() => policy.requesterRestrictions.remove(i)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
                <Grid item xs={11}>
                  {policy.requestRestrictions.state.map((_, i) => (
                    <Restriction keys={[i]} />
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </FormSection>
      <FormSection title={'Requester Rules'} className={classes.section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MenuButton options={[]} onSelectOption={(i) => {}}>
              Add
            </MenuButton>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button onClick={() => policy.requesterRestrictions.clear()}>
              Clear
            </Button>
          </Grid>
        </Grid>
        <Grid container item>
          {/*  */}
          {policy.requesterRestrictions.state.map((_, i) => (
            <Grid container item xs={12} alignItems={'stretch'}>
              <Grid item xs={1}>
                <IconButton
                  onClick={() => policy.requesterRestrictions.remove(i)}
                >
                  <Delete />
                </IconButton>
              </Grid>
              <Grid item xs={11}></Grid>
            </Grid>
          ))}
        </Grid>
      </FormSection>
    </LoadingWrapper>
  )
}

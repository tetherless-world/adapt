import { makeStyles } from '@material-ui/core'

export const useRestrictionSectionStyles = makeStyles((theme) => ({
  header: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  restrictions: {},
  deleteButton: {
    marginRight: theme.spacing(3),
  },
}))

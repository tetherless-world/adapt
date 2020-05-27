import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'

const theme = createMuiTheme({
  props: {
    MuiButton: {
      variant: 'outlined',
      color: 'primary',
      size: 'small',
    },
    MuiTextField: {
      fullWidth: true,
      variant: 'outlined',
      size: 'small',
      required: true,
    },
  },
})

export default responsiveFontSizes(theme)

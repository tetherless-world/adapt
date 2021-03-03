import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core'

const theme: Theme = createMuiTheme({
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

const responsiveTheme = responsiveFontSizes(theme)

export { responsiveTheme as theme }

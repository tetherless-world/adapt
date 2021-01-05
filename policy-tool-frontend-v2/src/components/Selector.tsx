import { MenuItem, TextField, TextFieldProps } from '@material-ui/core'

export interface SelectorOption {
  label: string | number
  value: any
}

export interface SelectorProps {
  options?: SelectorOption[]
  displayNone?: boolean
}

export const Selector: React.FC<SelectorProps & TextFieldProps> = ({
  options = [],
  displayNone = true,
  ...props
}) => (
  <TextField {...props} select>
    {displayNone && (
      <MenuItem value={''}>
        <em>None</em>
      </MenuItem>
    )}
    {!!options?.length &&
      options.map(({ label, value }, i) => (
        <MenuItem key={i} value={value}>
          {label}
        </MenuItem>
      ))}
  </TextField>
)

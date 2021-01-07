import {
  MenuItem,
  MenuItemProps,
  TextField,
  TextFieldProps,
} from '@material-ui/core'

export interface SelectorOption {
  label: string
  value: any
  menuItemProps?: MenuItemProps
}

export interface SelectorProps {
  options?: SelectorOption[]
  displayNone?: boolean
  textFieldProps?: TextFieldProps
}

export const Selector: React.FC<SelectorProps> = ({
  options = [],
  displayNone = true,
  textFieldProps = {},
}) => (
  <TextField {...textFieldProps} select>
    {displayNone && (
      <MenuItem value={''}>
        <em>None</em>
      </MenuItem>
    )}
    {!!options?.length &&
      options.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
  </TextField>
)

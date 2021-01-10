import { MenuItem, TextField, TextFieldProps } from '@material-ui/core'
import { Option } from '../contexts/OptionMapContext'

export interface SelectorProps {
  options?: Option[]
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

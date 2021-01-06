import {
  MenuItem,
  MenuItemClassKey,
  MenuItemProps,
  StandardProps,
} from '@material-ui/core'

export interface MenuOptionProps
  extends StandardProps<MenuItemProps, MenuItemClassKey> {
  label: string
}

export const MenuOption: React.FC<MenuOptionProps> = ({ label, ...props }) => (
  <MenuItem {...props} button>
    {label}
  </MenuItem>
)

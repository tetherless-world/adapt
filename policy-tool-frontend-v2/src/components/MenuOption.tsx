import { MenuItem, MenuItemProps } from '@material-ui/core'

export interface MenuOptionProps {
  label: string
  menuItemProps?: MenuItemProps
}

export const MenuOption: React.FC<MenuOptionProps> = ({
  label,
  menuItemProps = {},
}) => (
  <MenuItem {...menuItemProps} button>
    {label}
  </MenuItem>
)

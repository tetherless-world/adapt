import { MenuItem, MenuItemProps } from '@material-ui/core'

export interface MenuOptionProps extends MenuItemProps {
  label: string
}

export const MenuOption: React.FC<MenuOptionProps> = ({ label, ...props }) => (
  <MenuItem {...props} button>
    {label}
  </MenuItem>
)

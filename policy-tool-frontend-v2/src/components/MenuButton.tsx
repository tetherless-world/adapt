import {
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  MenuItemProps,
  MenuProps,
} from '@material-ui/core'
import { useState } from 'react'

export interface MenuOptionProps extends MenuItemProps {
  label: string
}

export interface MenuButtonProps extends ButtonProps {
  options: MenuOptionProps[]
  onSelectOption: (i: number) => void
  menuProps?: MenuProps
}

export const MenuOption: React.FC<MenuOptionProps> = ({ label, ...props }) => (
  <MenuItem {...props} button>
    {label}
  </MenuItem>
)

export const MenuButton: React.FC<MenuButtonProps> = ({
  options,
  onSelectOption,
  menuProps = {},
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const handleClick = (event: any) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleSelect = (i: number) => {
    onSelectOption(i)
    handleClose()
  }

  return (
    <>
      <Button
        aria-controls={'menu'}
        aria-aria-haspopup
        onClick={handleClick}
        {...props}
      />
      <Menu
        id={'menu'}
        keepMounted
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 300 } }}
        {...menuProps}
      >
        {!!options?.length &&
          options.map((option, i) => (
            <MenuOption key={i} onClick={() => handleSelect(i)} {...option} />
          ))}
      </Menu>
    </>
  )
}

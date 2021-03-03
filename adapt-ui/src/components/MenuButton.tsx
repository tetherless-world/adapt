import {
  Button,
  ButtonProps,
  Menu,
  MenuItem,
  MenuItemProps,
  MenuProps,
} from '@material-ui/core'
import { useState } from 'react'

export interface MenuOptionProps {
  label: string
  menuItemProps?: MenuItemProps
}

export interface MenuButtonProps {
  options: MenuOptionProps[]
  onSelectOption(index: number): void
  buttonProps?: ButtonProps
  menuProps?: MenuProps
}

export const MenuButton: React.FC<MenuButtonProps> = ({
  options = [],
  onSelectOption,
  buttonProps = {},
  menuProps = {
    PaperProps: { style: { maxHeight: 300 } },
  },
}) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const handleClickButton = (event: any) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleSelect = (index: number) => {
    onSelectOption(index)
    handleClose()
  }

  return (
    <>
      <Button
        {...buttonProps}
        aria-controls={'menu'}
        aria-haspopup
        onClick={handleClickButton}
      />
      <Menu
        id={'menu'}
        keepMounted
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        {...menuProps}
      >
        {options.map((option, i) => (
          <MenuItem
            key={i}
            onClick={() => handleSelect(i)}
            {...option.menuItemProps}
            button
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

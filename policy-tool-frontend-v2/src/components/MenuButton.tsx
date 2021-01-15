import { Button, ButtonProps, Menu, MenuProps } from '@material-ui/core'
import { useState } from 'react'
import { MenuOption, MenuOptionProps } from './MenuOption'

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
          <MenuOption
            label={option.label}
            menuItemProps={{
              ...option.menuItemProps,
              onClick: () => handleSelect(i),
            }}
          />
        ))}
      </Menu>
    </>
  )
}

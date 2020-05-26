import React, { useState } from 'react'
import { Menu, MenuItem, Button } from '@material-ui/core'

export default function MenuButton({
  options,
  ButtonProps = {},
  MenuProps = {},
  onSelect = (index) => {},
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleCloseWithSelection = (index) => () => {
    onSelect(index)
    handleClose()
  }

  return (
    <>
      <Button
        aria-controls={'menu'}
        aria-haspopup={'true'}
        onClick={handleClick}
        disabled={!options?.length}
        {...ButtonProps}
        {...props}
      />
      <Menu
        id={'menu'}
        keepMounted
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        PaperProps={{ style: { maxHeight: 300 } }}
        {...MenuProps}
      >
        {!!options?.length &&
          options.map(({ label, ...ItemProps }, index) => (
            <MenuItem
              key={index}
              onClick={handleCloseWithSelection(index)}
              {...ItemProps}
            >
              {label}
            </MenuItem>
          ))}
      </Menu>
    </>
  )
}

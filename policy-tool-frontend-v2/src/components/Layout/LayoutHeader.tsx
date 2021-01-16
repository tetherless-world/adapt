import {
  AppBar,
  AppBarProps,
  Toolbar,
  ToolbarProps,
  Typography,
  TypographyProps,
} from '@material-ui/core'

export interface LayoutHeaderProps {
  title: string
  appBarProps?: AppBarProps
  toolbarProps?: ToolbarProps
  typographyProps?: Omit<TypographyProps, 'children'>
}

const defaultTypographyProps: TypographyProps = {
  variant: 'h5',
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  title,
  appBarProps = {},
  toolbarProps = {},
  typographyProps = defaultTypographyProps,
}) => {
  return (
    <AppBar {...appBarProps}>
      <Toolbar {...toolbarProps}>
        <Typography {...defaultTypographyProps} {...typographyProps}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

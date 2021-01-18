import { Box, BoxProps, Container, ContainerProps } from '@material-ui/core'
import React from 'react'

export interface LayoutProps {
  header: React.ReactNode
  body: React.ReactNode
  containerProps?: ContainerProps
  headerBoxProps?: BoxProps
  bodyBoxProps?: BoxProps
}

export const Layout: React.FC<LayoutProps> = ({
  header,
  body,
  containerProps = {},
  headerBoxProps = {},
  bodyBoxProps = {},
}) => (
  <Container {...containerProps}>
    <Box {...headerBoxProps}>{header}</Box>
    <Box {...bodyBoxProps}>{body}</Box>
  </Container>
)

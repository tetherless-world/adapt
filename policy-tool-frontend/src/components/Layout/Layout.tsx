import { Container, ContainerProps } from '@material-ui/core'
import React from 'react'

export interface LayoutProps {
  header: React.ReactNode
  body: React.ReactNode
  containerProps?: ContainerProps
}

export const Layout: React.FC<LayoutProps> = ({
  header,
  body,
  containerProps = {},
}) => (
  <Container {...containerProps}>
    {header}
    {body}
  </Container>
)

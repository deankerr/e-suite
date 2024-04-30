'use client'

import { Theme } from '@radix-ui/themes'

const LayoutFixture = ({ children }: { children: React.ReactNode }) => {
  return (
    <Theme accentColor="orange" appearance="dark" panelBackground="translucent">
      {children}
    </Theme>
  )
}

export default LayoutFixture

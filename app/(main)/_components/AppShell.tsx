'use client'

import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Label,
  Progress,
  Spinner,
  TextInput,
} from 'flowbite-react'
import { AppSidebar } from './AppSidebar'
import { Logo } from './Logo'

type AppShellProps = {
  props?: any
}
export const AppShell = ({ props }: AppShellProps) => {
  return (
    <div className="flex h-full">
      <AppSidebar />
      <div className="hidden grow space-y-4">
        <Alert color="info">Alert!</Alert>

        <div className="flex flex-wrap gap-2">
          <Button
            processingLabel="Processing"
            // processingSpinner={<Spinner color="pink" aria-label="Pink spinner example" />}
            isProcessing={true}
          >
            Default
          </Button>
          <Button color="blue">Blue</Button>
          <Button color="gray">Gray</Button>
          <Button color="dark">Dark</Button>
          <Button color="light">Light</Button>
          <Button color="success">Success</Button>
          <Button color="failure">Failure</Button>
          <Button color="warning">Warning</Button>
          <Button color="purple">Purple</Button>
        </div>

        <Logo />

        <div className="flex flex-wrap gap-2">
          <Button gradientMonochrome="info">Info</Button>
          <Button gradientMonochrome="success">Success</Button>
          <Button gradientMonochrome="cyan">Cyan</Button>
          <Button gradientMonochrome="teal">Teal</Button>
          <Button gradientMonochrome="lime">Lime</Button>
          <Button gradientMonochrome="failure">Failure</Button>
          <Button gradientMonochrome="pink">Pink</Button>
          <Button gradientMonochrome="purple">Purple</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button gradientDuoTone="purpleToBlue">Purple to Blue</Button>
          <Button gradientDuoTone="cyanToBlue">Cyan to Blue</Button>
          <Button gradientDuoTone="greenToBlue">Green to Blue</Button>
          <Button gradientDuoTone="purpleToPink">Purple to Pink</Button>
          <Button gradientDuoTone="pinkToOrange">Pink to Orange</Button>
          <Button gradientDuoTone="tealToLime">Teal to Lime</Button>
          <Button gradientDuoTone="redToYellow">Red to Yellow</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button outline gradientDuoTone="purpleToBlue">
            Purple to Blue
          </Button>
          <Button outline gradientDuoTone="cyanToBlue">
            Cyan to Blue
          </Button>
          <Button outline gradientDuoTone="greenToBlue">
            Green to Blue
          </Button>
          <Button outline gradientDuoTone="purpleToPink">
            Purple to Pink
          </Button>
          <Button outline gradientDuoTone="pinkToOrange">
            Pink to Orange
          </Button>
          <Button outline gradientDuoTone="tealToLime">
            Teal to Lime
          </Button>
          <Button outline gradientDuoTone="redToYellow">
            Red to Yellow
          </Button>
        </div>

        <ButtonGroup>
          <Button>One!</Button>
          <Button>Two!</Button>
        </ButtonGroup>
        <Progress progress={66} />
        <Spinner color="warning" aria-label="Warning spinner example" />
        <Spinner color="pink" aria-label="Pink spinner example" />
        <Spinner color="purple" aria-label="Purple spinner example" />
        <FormCard />
      </div>
    </div>
  )
}

function FormCard() {
  return (
    <Card className="max-w-sm">
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput id="email1" type="email" placeholder="name@flowbite.com" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password1" type="password" required />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  )
}

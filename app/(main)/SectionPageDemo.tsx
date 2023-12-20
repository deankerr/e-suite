import { Page } from '@/components/Page'

export const SectionPageDemo = () => {
  return (
    <Page>
      <Page.Main>
        <Page.MainHeader>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Main Head</h1>
        </Page.MainHeader>
        <Page.MainContent>{lorem}</Page.MainContent>
      </Page.Main>

      <Page.Aside>
        <Page.AsideHeader>
          <h3 className="text-xl font-semibold leading-none tracking-tight">Aside Right Head</h3>
        </Page.AsideHeader>
        <Page.AsideContent>Aside Right Content</Page.AsideContent>
      </Page.Aside>
    </Page>
  )
}

const lorem = (
  <>
    <p className="">
      Duis nisi proident nulla tempor incididunt minim aliqua reprehenderit incididunt fugiat
      officia. Officia ad esse laboris et non do pariatur ut mollit dolor. Ea sunt consequat enim
      aliquip quis Lorem ipsum magna id ex ea id ad sit voluptate. Irure reprehenderit sit minim do
      est culpa. Eu consequat officia aliquip excepteur exercitation. Minim dolore duis nulla
      consectetur cupidatat ad eiusmod culpa adipisicing pariatur. Officia eiusmod sit occaecat ut
      eu duis ad quis proident. Ipsum et culpa sint excepteur irure exercitation officia incididunt
      qui veniam et reprehenderit cupidatat ad amet.
    </p>
    <p className="">
      Irure aliquip non amet occaecat aliquip voluptate ea consequat laborum veniam et incididunt
      anim. Sit adipisicing reprehenderit ex elit proident nulla. Fugiat anim aliqua velit aliqua
      consequat eiusmod nulla ullamco. Exercitation Lorem irure sit dolore et nisi. Esse ea non
      cillum aliquip sit esse minim ullamco laboris culpa ullamco laboris dolor. Ad fugiat irure
      laboris pariatur. Mollit aliqua amet non laboris sunt elit quis. Sit eu magna et minim labore
      aliquip sit quis ullamco.
    </p>
    <p className="">
      Excepteur dolore amet quis laboris fugiat cillum exercitation anim. In deserunt laborum
      nostrud et culpa deserunt laborum consequat est amet proident veniam. Consectetur proident
      voluptate reprehenderit et dolore culpa commodo quis ut. Laborum officia irure id dolore ut
      incididunt aliquip occaecat ut nulla veniam. Voluptate ullamco proident commodo amet amet
      adipisicing. Quis deserunt mollit quis aliqua.
    </p>
  </>
)

import { Page } from '@/components/Page'

type ExplorePageProps = {
  props?: any
}

export const ExplorePage = ({ props }: ExplorePageProps) => {
  return (
    <Page>
      <Page.Main>
        <Page.MainHeader className="">
          <Page.H1>Explore</Page.H1>
        </Page.MainHeader>
        <Page.MainContent>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Chats and tables</h1>
        </Page.MainContent>
      </Page.Main>
    </Page>
  )
}

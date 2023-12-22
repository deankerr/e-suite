import { ChatBubble } from '@/components/inference/ChatBubble'
import { ChatInput } from '@/components/inference/ChatInput'
import { Page } from '@/components/Page'

export const ChatPage = () => {
  return (
    <Page>
      <Page.Main>
        <Page.MainHeader className="">
          <Page.H1>Chat Demo</Page.H1>
        </Page.MainHeader>

        <Page.MainContent>
          <div className="mx-auto w-fit space-y-8">
            <ChatBubble role="user">
              <p className="">
                Non et et reprehenderit nostrud. Excepteur culpa duis elit irure cupidatat sint.
              </p>
            </ChatBubble>

            <ChatBubble>
              <p className="">
                Culpa commodo qui eu ut reprehenderit irure ut consequat dolor eiusmod tempor. Esse
                tempor eu consectetur sunt sint nisi ex voluptate est ea dolor sit sint. Fugiat ut
                sint excepteur irure. Eu sint cupidatat aute in ut. Ex est nostrud consequat
                voluptate eiusmod nisi reprehenderit voluptate ex et qui do. Officia ullamco enim
                occaecat anim nostrud fugiat sint nulla anim ullamco ad culpa enim ullamco. Velit
                magna laborum labore qui nulla occaecat deserunt aute anim tempor consectetur.
              </p>
              <p className="">
                Ipsum consectetur voluptate aliquip ut quis nisi adipisicing elit quis eu anim. Id
                non in ad commodo officia minim velit qui. In commodo do duis laboris nostrud ex non
                consectetur. Nostrud qui culpa et ad est labore quis esse est laboris fugiat
                consequat cupidatat nostrud. Laborum mollit voluptate velit ex labore excepteur
                fugiat culpa irure adipisicing veniam velit deserunt. Nisi eu consectetur sint nisi
                fugiat. Mollit sit tempor magna ut veniam eu dolor sunt minim ipsum exercitation.
                Labore minim ut anim nostrud consequat anim nulla laborum veniam velit veniam minim
                qui qui laborum.
              </p>
              <p className="">
                Mollit ex occaecat velit nisi et laboris est ea ullamco dolore irure. Ipsum qui
                voluptate quis aliquip quis proident tempor deserunt deserunt tempor exercitation
                esse. Aliqua reprehenderit esse occaecat do officia ipsum dolore minim Lorem
                pariatur ullamco Lorem laboris. Magna non id id sunt dolore qui ut magna ea ullamco.
                Culpa cupidatat cillum quis est consectetur tempor quis minim labore ex excepteur
                est elit. Pariatur ea reprehenderit proident ex ipsum fugiat irure occaecat occaecat
                ipsum ad do amet laboris pariatur. Consectetur sunt dolor nisi magna mollit et. Ad
                in ipsum aliquip laboris irure occaecat minim sint.
              </p>
            </ChatBubble>

            <ChatBubble role="user">
              <p className="">
                Cillum occaecat in exercitation velit exercitation eiusmod mollit sunt incididunt.
              </p>
              <p className="">
                Enim irure ea id do esse cillum occaecat consequat excepteur esse esse labore.
              </p>
              <p className="">
                Sit laborum consequat commodo qui incididunt amet eiusmod fugiat deserunt quis.
              </p>
            </ChatBubble>

            <ChatBubble>
              <p className="">
                Aliqua magna sunt amet id exercitation. Mollit deserunt ex excepteur reprehenderit
                deserunt officia non aliquip mollit sit excepteur. Est officia anim fugiat irure
                veniam minim nisi ullamco aute laborum aliquip. Et aliquip elit veniam sunt in
                exercitation deserunt fugiat. Sit qui elit cillum laborum ad ea anim. Incididunt
                nulla exercitation ut labore. Adipisicing mollit minim sint mollit reprehenderit
                esse pariatur do est ad dolor occaecat officia. Consequat deserunt est est nulla
                velit.
              </p>

              <p className="">
                Laborum mollit proident qui sint occaecat reprehenderit incididunt. Laboris aliqua
                est fugiat. Anim ea amet consectetur enim est. Quis irure ut aute voluptate culpa.
                Ullamco Lorem quis aute ea id ad reprehenderit irure laborum ad minim est. Et
                cupidatat reprehenderit nisi sit sint laborum reprehenderit. Commodo excepteur
                mollit officia irure ea amet nulla id nisi aute.
              </p>

              <p className="">
                Ea culpa proident velit ea cupidatat incididunt consectetur est nisi ea aliqua.
                Proident aliqua culpa est occaecat elit ut dolore est nisi esse nostrud. Nisi ex eu
                pariatur nisi proident. Aute enim ex eu amet sint sunt ullamco mollit elit id Lorem
                non ut nostrud deserunt.
              </p>
              <p className="">
                Ut et qui non sunt do tempor in excepteur irure sint pariatur quis duis nostrud
                aute. Laborum sunt culpa pariatur irure qui consequat commodo officia velit tempor
                ullamco officia. Magna id sit voluptate deserunt est excepteur minim aliqua
                excepteur eiusmod non adipisicing qui ut. Anim qui cupidatat sit nulla consectetur
                magna sit culpa. Eu ipsum ullamco quis eu. Ut ea consectetur quis dolore magna
                reprehenderit elit amet. Ex nostrud sunt qui voluptate irure adipisicing officia
                veniam ea. Tempor ad non est cillum veniam ut ut amet sit laboris veniam dolore
                nulla amet excepteur.
              </p>
            </ChatBubble>
          </div>
        </Page.MainContent>

        <Page.MainFooter>
          <ChatInput />
        </Page.MainFooter>
      </Page.Main>

      <Page.Aside>
        <Page.AsideHeader>hmm</Page.AsideHeader>
        <Page.AsideContent>gogogo</Page.AsideContent>
      </Page.Aside>
    </Page>
  )
}

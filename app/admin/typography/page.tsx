import { Card, Heading, Text } from '@radix-ui/themes'
import { useTitle } from 'react-use'

export default function Page() {
  useTitle('admin - type')

  return (
    <div className="space-y-3 p-3">
      <p>type</p>
      <div className="grid grid-cols-3 gap-3">
        <Card className="">
          Radix Headings
          {/* test all heading sizes */}
          <Heading size="9" color="amber">
            Heading 9
          </Heading>
          <Heading size="8">Heading 8</Heading>
          <Heading size="7" color="crimson">
            Heading 7
          </Heading>
          <Heading size="6">Heading 6</Heading>
          <Heading size="5" color="gray">
            Heading 5
          </Heading>
          <Heading size="4">Heading 4</Heading>
          <Heading size="3" color="amber">
            Heading 3
          </Heading>
          <Heading size="2">Heading 2</Heading>
          <Heading size="1">Heading 1</Heading>
        </Card>

        <Card className="">
          Wise Type
          <div className="text-3xl font-semibold tracking-tight">Title screen</div>
          <div className="text-2xl font-semibold">Title section</div>
          <div className="text-xl font-semibold">Title subsection</div>
          <div className="text-lg font-semibold">Title body</div>
          <div className="text-sm font-medium">Title group</div>
          <div className="text-base">Body large</div>
          <div className="text-base font-semibold">Body large bold</div>
          <div className="text-sm">Body default</div>
          <div className="text-sm font-semibold">Body default bold</div>
          <div className="text-base font-semibold underline">Link large</div>
          <div className="text-sm font-semibold underline">Link default</div>
        </Card>

        <Card className="">
          Radix Text
          <Text as="p" size="9" color="amber">
            Text 9
          </Text>
          <Text as="p" size="8">
            Text 8
          </Text>
          <Text as="p" size="7" color="crimson">
            Text 7
          </Text>
          <Text as="p" size="6">
            Text 6
          </Text>
          <Text as="p" size="5" color="gray">
            Text 5
          </Text>
          <Text as="p" size="4">
            Text 4
          </Text>
          <Text as="p" size="3" color="amber">
            Text 3
          </Text>
          <Text as="p" size="2">
            Text 2
          </Text>
          <Text as="p" size="1">
            Text 1
          </Text>
        </Card>

        <Card>
          <Heading size="4">Radix Paragraph Text 4</Heading>
          <Text size="4" as="p" mb="5">
            {paragraph1}
          </Text>
          <Text size="4" as="p">
            {paragraph2}
          </Text>
        </Card>

        <Card>
          <Heading size="3">Radix Paragraph Text 3</Heading>
          <Text size="3" as="p" mb="5">
            {paragraph1}
          </Text>
          <Text size="3" as="p">
            {paragraph2}
          </Text>
        </Card>

        <Card>
          <Heading size="2">Radix Paragraph Text 2</Heading>
          <Text size="2" as="p" mb="3">
            {paragraph1}
          </Text>
          <Text size="2" as="p">
            {paragraph2}
          </Text>
        </Card>

        <Card className="prose prose-invert">
          Prose Paragraph Text
          <p>{paragraph1}</p>
          <p>{paragraph2}</p>
        </Card>

        <Card>
          <div className="text-lg font-semibold">Wise Paragraph Text Large</div>
          <p className="mb-2 text-base">{paragraph1}</p>
          <p className="text-base">{paragraph2}</p>
        </Card>

        <Card>
          <div className="text-lg font-semibold">Wise Paragraph Text Default</div>
          <p className="mb-2 text-sm">{paragraph1}</p>
          <p className="text-sm">{paragraph2}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Card className="h-60 w-96">
          <div className="wt-title-1">Card Title</div>
        </Card>

        <Card className=" h-60 w-96">
          <div className="wt-title-2">Card Title</div>
        </Card>

        <Card className="h-60 w-96">
          <div className="wt-title-3">Card Title</div>
        </Card>

        <Card className="card-bg-1 h-60 w-96">
          <div className="wt-title-4 ">Card Title</div>
        </Card>
      </div>
    </div>
  )
}

const paragraph1 = `Since early in the history of flight, non-human animals have been dropped from heights
            with the benefit of parachutes. Early on, animals were used as test subjects for
            parachutes and as entertainment. Following the development of the balloon, dogs, cats,
            fowl, and sheep were dropped from heights. During the 18th and 19th-century ballooning
            craze known as balloonomania, many aeronauts included parachuting animals such as
            monkeys in their demonstrations.`

const paragraph2 = `Later, animals were parachuted from airplanes, as test subjects, for amusement, and as a
            means of transporting working animals. During World War II, the many dogs parachuted
            from planes came to be known as "paradogs". Animal test subjects included a
            bear parachuted at supersonic speeds. Bat bombs, devised by the U.S. military, were
            designed to parachute a canister containing thousands of bomb-laden bats in Japan.
            Parachutes have also been used to transport animals, including mules and sheepdogs. In
            1948, beaver drops in the United States parachuted beavers that were considered
            nuisances to remote locations.`

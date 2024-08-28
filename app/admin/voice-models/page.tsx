'use client'

import { useState } from 'react'
import { Play as PlayIcon } from '@phosphor-icons/react/dist/ssr'
import { IconButton, Table, Tabs } from '@radix-ui/themes'
import fuzzysort from 'fuzzysort'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { SearchField } from '@/components/ui/SearchField'
import { useVoiceModels } from '@/lib/api'

export default function Page() {
  // const textVoiceover = useMutation(api.db.voiceover.text)
  // const { howl } = useHowl({
  //   src: url ?? 'none',
  //   format: ['mp3'],
  // })

  const voiceModels = useVoiceModels()
  const [searchValue, setSearchValue] = useState('')

  const sortResults = fuzzysort.go(searchValue, voiceModels ?? [], {
    keys: ['resourceKey', 'name', 'creatorName'],
    all: true,
  })
  const modelsList = sortResults.map(({ obj }) => obj)

  return (
    <AdminPageWrapper>
      {/* <Play
        howl={howl}
        onEnd={() => {
          setSampleFileId('')
        }}
      /> */}
      <Tabs.Root defaultValue="table">
        <Tabs.List>
          <Tabs.Trigger value="table">Table</Tabs.Trigger>
        </Tabs.List>

        <div className="mt-2">
          <div className="space-y-2 py-2">
            <SearchField value={searchValue} onValueChange={setSearchValue} />
            <div className="px-1 font-mono text-sm">
              {voiceModels && `models: ${sortResults.length}`}
              {/* {sampleFileId && <div>Sample: {sampleFileId}</div>} */}
            </div>
          </div>

          <Tabs.Content value="table">
            <Table.Root size="1" variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell maxWidth="60px" justify="center">
                    sample
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>resourceKey</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>creatorName</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>accent</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>gender</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {modelsList.map((model) => (
                  <Table.Row key={model.resourceKey}>
                    <Table.Cell maxWidth="60px" justify="center">
                      <IconButton
                        variant="surface"
                        size="1"
                        // onClick={() => {
                        //   textVoiceover({
                        //     text: 'Hi, my name is Werner Brandes. My voice is my passport. Verify Me.',
                        //     resourceKey: model.resourceKey,
                        //   })
                        //     .then((fileId) => {
                        //       setSampleFileId(fileId)
                        //     })
                        //     .catch((err) => {
                        //       console.error(err)
                        //     })
                        // }}
                      >
                        <PlayIcon className="size-4" />
                      </IconButton>
                    </Table.Cell>
                    <Table.Cell className="break-all font-mono">{model.resourceKey}</Table.Cell>
                    <Table.Cell>{model.name}</Table.Cell>
                    <Table.Cell>{model.creatorName}</Table.Cell>
                    <Table.Cell>{model?.accent}</Table.Cell>
                    <Table.Cell>{model?.gender}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </AdminPageWrapper>
  )
}

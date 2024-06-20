'use client'

import { useEffect, useState } from 'react'
import { Play } from '@phosphor-icons/react/dist/ssr'
import { IconButton, Table, Tabs } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import fuzzysort from 'fuzzysort'
import { useGlobalAudioPlayer } from 'react-use-audio-player'

import { AdminPageWrapper } from '@/app/admin/AdminPageWrapper'
import { SearchField } from '@/components/form/SearchField'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useVoiceModels } from '@/lib/queries'

export default function Page() {
  const { load } = useGlobalAudioPlayer()
  const textVoiceover = useMutation(api.db.voiceover.text)
  const [sampleFileId, setSampleFileId] = useState('')
  const sampleFile = useQuery(
    api.db.speechFiles.getById,
    sampleFileId ? { speechFileId: sampleFileId as Id<'speech_files'> } : 'skip',
  )

  const url = sampleFile?.fileUrl

  useEffect(() => {
    if (url) {
      load(url, {
        autoplay: true,
        format: 'mp3',
        onend: () => setSampleFileId(''),
      })
    }
  }, [load, url])

  const voiceModels = useVoiceModels()
  const [searchValue, setSearchValue] = useState('')

  const sortResults = fuzzysort.go(searchValue, voiceModels.data ?? [], {
    keys: ['resourceKey', 'name', 'creatorName'],
    all: true,
  })
  const modelsList = sortResults.map(({ obj }) => obj)

  return (
    <AdminPageWrapper>
      <Tabs.Root defaultValue="table">
        <Tabs.List>
          <Tabs.Trigger value="table">Table</Tabs.Trigger>
        </Tabs.List>

        <div className="mt-2">
          <div className="space-y-2 py-2">
            <SearchField value={searchValue} onValueChange={setSearchValue} />
            <div className="px-1 font-mono text-sm">
              {voiceModels.isPending && 'loading...'}
              {voiceModels.isError && 'error'}
              {voiceModels.isSuccess && `models: ${sortResults.length}`}
              {sampleFileId && <div>Sample: {sampleFileId}</div>}
            </div>
          </div>

          <Tabs.Content value="table">
            <Table.Root size="1" variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell maxWidth="40px">sample</Table.ColumnHeaderCell>
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
                    <Table.Cell maxWidth="40px" justify="end">
                      <IconButton
                        variant="surface"
                        size="1"
                        onClick={() => {
                          textVoiceover({
                            text: 'Hi, my name is Werner Brandes. My voice is my passport. Verify Me.',
                            resourceKey: model.resourceKey,
                          })
                            .then((fileId) => {
                              setSampleFileId(fileId)
                            })
                            .catch((err) => {
                              console.error(err)
                            })
                        }}
                      >
                        <Play className="size-4" />
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

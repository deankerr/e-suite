import * as Icons from '@phosphor-icons/react/dist/ssr'
import { useSetAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'

import { shellSelectedModelAtom, shellThreadTitleValueAtom } from '@/components/shell/atoms'
import { CmdK } from '@/components/shell/CmdK'
import {
  useIsCurrentPage,
  useShellActions,
  useShellStack,
  useShellUserThreads,
} from '@/components/shell/hooks'
import { appConfig } from '@/config/config'

export const ThreadConfig = () => {
  const pathname = usePathname()
  const router = useRouter()
  const threads = useShellUserThreads()

  const setThreadTitleValue = useSetAtom(shellThreadTitleValueAtom)
  const setSelectedModel = useSetAtom(shellSelectedModelAtom)

  const stack = useShellStack()
  const shell = useShellActions()

  const isCurrentPage = useIsCurrentPage('ThreadConfig')
  if (!isCurrentPage) return null
  return (
    <>
      {threads.current ? (
        <CmdK.Group heading={`Options`}>
          {!pathname.endsWith(threads.current.slug) && (
            <CmdK.Item
              onSelect={() => {
                router.push(`${appConfig.chatUrl}/${threads.current?.slug}`)
                shell.close()
              }}
            >
              <Icons.TagChevron weight="light" className="phosphor" />
              Open
            </CmdK.Item>
          )}

          <CmdK.Item
            onSelect={() => {
              setThreadTitleValue(threads.current?.title ?? '')
              stack.push('EditThreadTitle')
            }}
          >
            <Icons.PencilLine weight="light" />
            Edit title
          </CmdK.Item>

          <CmdK.Item
            onSelect={() => {
              setSelectedModel(threads.current?.model ?? null)
              stack.push('ModelPicker')
            }}
          >
            <Icons.Cube weight="light" />
            Model: {threads.current.model?.name ?? 'unknown model'}
          </CmdK.Item>

          <CmdK.Item>
            <Icons.UserSound weight="light" />
            Voiceover: {threads.current.voiceovers?.default ?? 'unknown model'}
          </CmdK.Item>

          <CmdK.Item onSelect={() => stack.push('DeleteThread')}>
            <Icons.Trash weight="light" />
            Delete
          </CmdK.Item>

          <CmdK.Item onSelect={() => stack.pop()}>
            <Icons.ArrowLeft weight="light" />
            Back
          </CmdK.Item>
        </CmdK.Group>
      ) : threads.current === null ? (
        <CmdK.Item>Thread not found.</CmdK.Item>
      ) : (
        <CmdK.Loading />
      )}
    </>
  )
}

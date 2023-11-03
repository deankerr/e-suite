import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { Table, TableBody, TableCell, TableRow } from '../ui/table'

export function EngineTable({
  engine,
  className,
}: {
  engine: Engine
  children?: React.ReactNode
} & React.ComponentProps<'div'>) {
  return (
    <>
      <div className={cn('', className)}>
        <h3 className="mb-0">Details</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Creator</TableCell>
              <TableCell>{engine?.creatorName}</TableCell>
              <TableCell className="font-medium">Model Type</TableCell>
              <TableCell>{engine.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Released</TableCell>
              <TableCell>{engine.releaseDate.toLocaleDateString('en-gb')}</TableCell>
              <TableCell className="font-medium">Parameters</TableCell>
              <TableCell>{engine.parameterSize} billion</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">License</TableCell>
              <TableCell>{engine?.license}</TableCell>
              <TableCell className="font-medium">Context Length</TableCell>
              <TableCell>{engine.contextLength} tokens</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Datasheet</TableCell>
              <TableCell>{engine.url}</TableCell>
              <TableCell className="font-medium">Datasheet</TableCell>
              <TableCell>{engine.url}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Prompt Format</TableCell>
              <TableCell>{engine?.promptFormat}</TableCell>
              <TableCell className="font-medium">Stop Tokens</TableCell>
              <TableCell>{engine?.stopTokens}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h3 className="mb-0 mt-4">Description</h3>
        <p className="p-2 text-sm">{engine?.description}</p>

        <h3 className="mb-0 mt-4">Provider</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Provider</TableCell>
              <TableCell>{engine?.providerId}</TableCell>
              <TableCell className="font-medium">Model Status</TableCell>
              <TableCell>Available</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Input price
                <br />
                per 1K tokens
              </TableCell>
              <TableCell>${engine.priceInput} USD</TableCell>
              <TableCell className="font-medium">Sources Available</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Output price
                <br />
                per 1K tokens
              </TableCell>
              <TableCell>${engine.priceOutput} USD</TableCell>
              <TableCell className="font-medium">Response Limit</TableCell>
              <TableCell>{engine.hostMaxCompletionTokens} tokens</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  )
}

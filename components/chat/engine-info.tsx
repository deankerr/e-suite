import { EChatEngine } from '@/lib/api/schemas'
import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export function EngineInfo({
  engine,
  children,
  className,
}: {
  engine: EChatEngine
  children?: React.ReactNode
} & React.ComponentProps<'div'>) {
  return (
    <>
      <div className={cn('mx-auto max-w-xl', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="w-full text-center">
                Specifications
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>creator:</TableCell>
              <TableCell>{engine?.metadata.creator}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>model:</TableCell>
              <TableCell>{engine?.model}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>context length:</TableCell>
              <TableCell>{engine?.contextLength}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>licence:</TableCell>
              <TableCell>{engine?.metadata.licence}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>platform:</TableCell>
              <TableCell>{engine?.platform}</TableCell>
            </TableRow>
          </TableBody>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="w-full text-center">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>{engine?.metadata.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {children}
      </div>
    </>
  )
}

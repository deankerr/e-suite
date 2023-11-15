import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Engine } from '@prisma/client'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

export function EnginesDataTable({
  data,
  active,
  setActive,
}: {
  data: Engine[]
  active?: string | null
  setActive: (engineId: string) => void
}) {
  const columns: ColumnDef<Engine>[] = [
    {
      accessorKey: 'displayName',
      header: 'Model',
    },
    {
      accessorKey: 'type',
      header: 'Type',
    },
    {
      accessorKey: 'providerId',
      header: 'Provider',
    },
    {
      id: 'makeActive',
      cell: ({ row }) => {
        const engine = row.original
        const isActive = engine.id === active
        return isActive ? null : (
          <Button variant="default" className="px-2 py-0" onClick={() => setActive(engine.id)}>
            Activate
          </Button>
        )
      },
    },
  ]

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <div className="max-w-4xl">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter engines..."
          value={(table.getColumn('displayName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('displayName')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

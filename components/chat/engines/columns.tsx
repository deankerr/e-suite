'use client'

import { Engine } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Engine>[] = [
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
    accessorKey: 'creatorName',
    header: 'Creator',
  },
]

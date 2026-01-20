"use client"

import type React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No hay datos disponibles",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-5 w-full max-w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.cell(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

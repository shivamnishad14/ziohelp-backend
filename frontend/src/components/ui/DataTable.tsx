import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  //   getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table'
// import {
//   IconEdit,
//   IconTrash,
//   IconFileExport,
//   IconEye,
//   IconPlus,
//   IconDotsVertical,
//   IconColumns,
// } from '@tabler/icons-react'
import {
  FiEdit,
  FiTrash2,
  FiFile,
  FiEye,
  FiPlus,
  FiMoreVertical,
  FiColumns,
} from 'react-icons/fi'
// import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Search } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DataTableProps<T extends object> {
  data: T[]
  columns: ColumnDef<T>[]
  isLoading?: boolean
  onAddClick?: () => void
  startIcon?: React.ReactNode
  addLabel?: string
  addComponent?: React.ReactNode
  onEditClick?: (row: T) => void
  onViewClick?: (row: T) => void
  onDeleteClick?: (row: T) => void
  actionComponents?: React.ComponentType<{ rowData: T }>[]
  showEdit?: boolean
  showView?: boolean
  showDelete?: boolean
  showActions?: boolean
  showCheckbox?: boolean
  getDisabledKeys?: (row: T) => string[]
  page?: number
  totalPages?: number
  setPage?: (page: number) => void
  rowsPerPage?: number
  onRowsPerPageChange?: (size: number) => void
  pagination?: boolean
  showPagination?: boolean
  showRowsPerPage?: boolean
  showExportButton?: boolean
  showHideColumns?: boolean
  showFilter?: boolean
  onFilterChange?: (filters: any) => void
  onSelectionChanged?: (selectedRows: T[]) => void
  allData?: () => Promise<T[]>
  fileName?: string
  initialHiddenColumns?: string[]
  showSearch?: boolean
  searchPlaceholder?: string
  searchColumn?: string
  searchLabel?: string
  isExporting?: boolean
  totalCount?: number
  showUploadButton?: boolean
  isUploading?: boolean
  onUpload?: any
  showIndividualColumnSearch?: boolean
  onColumnSearch?: (columnName: string, value: string) => void
  searchableColumns?: string[]
  excelHeaderTitle?: string

}

export function DataTable<T extends object>({
  data = [],
  columns = [],
  // @ts-ignore - Might be used in future implementations
  isLoading = false,
  onAddClick,
  startIcon = <FiPlus />,
  addLabel = 'Add New',
  addComponent,
  onEditClick,
  onViewClick,
  onDeleteClick,
  actionComponents = [],
  showEdit = true,
  showView = false,
  showDelete = true,
  showActions = true,
  showCheckbox = false,
  // getDisabledKeys = () => [],
  page = 1,
  totalPages = 1,
  setPage,
  rowsPerPage = 10,
  onRowsPerPageChange,
  pagination = false,
  showPagination = true,
  showRowsPerPage = true,
  showExportButton = true,
  showHideColumns = true,
  // showFilter = true,
  // @ts-ignore - Might be used in future implementations
  onFilterChange,
  // @ts-ignore - Might be used in future implementations
  onSelectionChanged,
  allData,
  fileName,
  initialHiddenColumns = [],
  showSearch = true,
  searchPlaceholder = 'Search...',
  searchColumn = 'title',
  // @ts-ignore - Might be used in future implementations
  searchLabel = 'Search',
  isExporting = false,
  showUploadButton = false,
  isUploading = false,
  onUpload,
  totalCount,
  showIndividualColumnSearch = false,
  onColumnSearch,
  searchableColumns = [],
  excelHeaderTitle = 'Default Title',
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const initialVisibility: VisibilityState = {}
      columns.forEach((col) => {
        const accessorKey = (col as any).accessorKey as string
        if (accessorKey) {
          initialVisibility[accessorKey] =
            !initialHiddenColumns.includes(accessorKey)
        }
      })
      return initialVisibility
    }
  )
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // const [isFilterEnabled] = useState(false);

  // Add action column if needed
  const tableColumns = useMemo(() => {
    const cols = [...columns]

    if (showActions) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: any }) => {
          //   const disabledKeys = getDisabledKeys(row.original);
          const actionComponentsList = Array.isArray(actionComponents)
            ? actionComponents
            : []

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <FiMoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {showEdit && (
                  <DropdownMenuItem onClick={() => onEditClick?.(row.original)}>
                    <div className='flex items-center gap-2'>
                      <FiEdit /> Edit
                    </div>
                  </DropdownMenuItem>
                )}
                {showDelete && (
                  <DropdownMenuItem
                    onClick={() => onDeleteClick?.(row.original)}
                  >
                    <div className='flex items-center gap-2'>
                      <FiTrash2 /> Delete
                    </div>
                  </DropdownMenuItem>
                )}
                {showView && (
                  <DropdownMenuItem onClick={() => onViewClick?.(row.original)}>
                    <div className='flex items-center gap-2'>
                      <FiEye /> View
                    </div>
                  </DropdownMenuItem>
                )}
                {actionComponentsList.map((Component, index) => (
                  <DropdownMenuItem key={`custom-action-${index}`}>
                    <Component rowData={row.original} />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      } as ColumnDef<T>)
    }

    return cols
  }, [
    columns,
    showActions,
    actionComponents,
    showEdit,
    showDelete,
    showView,
    onEditClick,
    onDeleteClick,
    onViewClick,
  ]) // Removed getDisabledKeys from dependency array

  // Use data directly (parent handles pagination)
  const paginatedData = data

  const table = useReactTable({
    data: paginatedData, // Use data directly
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: showCheckbox,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })


  
const handleExport = async () => {
  const exportData = allData ? await allData() : data;

  // Prepare columns (exclude 'sno' and 'actions' columns from export)
  const visibleColumns = table
    .getAllColumns()
    .filter((column: any) => column.getIsVisible() && column.id !== 'sno' && column.id !== 'actions')
    .map((column: any) => ({
      header:
        typeof column.columnDef.header === 'string'
          ? column.columnDef.header
          : column.id,
      accessorKey: column.id,
    }));

  // Prepare header row
  const headers = ['S. No.', ...visibleColumns.map((col: any) => col.header)];

  // Prepare data rows
  const dataRows = exportData.map((row: any, index: number) => {
    const rowData: any[] = [index + 1];
    visibleColumns.forEach((col: any) => {
      const keys = col.accessorKey.split('.');
      let value: any = row;
      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          value = undefined;
          break;
        }
      }
      // Only push primitive values (string/number/boolean/null/undefined)
      if (typeof value === 'object' && value !== null) {
        rowData.push('');
      } else {
        rowData.push(value !== undefined ? value : '');
      }
    });
    return rowData;
  });

  // Build worksheet: title, header, data
  const ws_data = [
    [excelHeaderTitle], // Title row
    headers,       // Header row
    ...dataRows,   // Data rows
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  // Merge title row
  ws['!merges'] = ws['!merges'] || [];
  ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });

  // Style title row (A1)
  if (ws['A1']) {
    ws['A1'].s = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
  }
  // Style header row
  for (let C = 0; C < headers.length; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        ...(ws[cellAddress].s || {}),
        font: { bold: true, sz: 12 },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }
  }

  // Export
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Exported Data');
  XLSX.writeFile(wb, `${fileName || 'exported_data'}.xlsx`);
}

  // Pagination summary calculation
  const startIdx = (page - 1) * rowsPerPage + 1
  const endIdx = Math.min(page * rowsPerPage, totalCount ?? data.length)
  const totalEntries = totalCount ?? data.length

  const handleUploadClick = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row: any) => row.original)

    onUpload?.(selectedRows)
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      {/* Top Controls */}
      <div className='flex w-full flex-col items-center justify-between gap-2 md:flex-row md:gap-0'>
        <div className='flex w-full items-center gap-2 md:w-auto'>
          {onAddClick && (
            <Button variant='outline' onClick={onAddClick}>
              {startIcon}
              {addLabel}
            </Button>
          )}
          {addComponent && <div>{addComponent}</div>}
          {/* {showSearch && (isFilterEnabled || !showFilter) && ( */}
          {showSearch && (
            <div className='flex w-full items-center gap-2 md:w-auto'>
              <div className='relative w-full md:w-auto'>
                <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
                {(() => {
                  const searchCol = table
                    .getAllLeafColumns()
                    .find((col: any) => col.id === searchColumn)
                  return (
                    <Input
                      placeholder={searchPlaceholder}
                      value={(searchCol?.getFilterValue() as string) ?? ''}
                      onChange={(event) =>
                        searchCol?.setFilterValue(event.target.value)
                      }
                      className='h-8 w-full pl-8 md:w-[150px] lg:w-[250px]'
                    />
                  )
                })()}
              </div>
            </div>
          )}
          {/* Individual Column Search */}
          {showIndividualColumnSearch && searchableColumns.length > 0 && (
            <div className='flex w-full items-center gap-2 md:w-auto'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='h-8'>
                    <Search className='mr-2 h-4 w-4' />
                    Column Search
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-80'>
                  <div className='p-2 space-y-2'>
                    {searchableColumns.map((columnName) => (
                      <div key={columnName} className='space-y-1'>
                        <label className='text-sm font-medium capitalize'>
                          {columnName.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <Input
                          placeholder={`Search ${columnName}...`}
                          className='h-8'
                          onChange={(e) => onColumnSearch?.(columnName, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className='flex w-full items-center justify-end gap-2 md:w-auto'>
          {showRowsPerPage && pagination && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>{rowsPerPage} Rows</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => onRowsPerPageChange?.(size)}
                  >
                    {size} Rows
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showUploadButton && (
            <Button
              variant='outline'
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              Upload
            </Button>
          )}

          {showExportButton && (allData || data.length > 0) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    onClick={handleExport}
                    disabled={isExporting}
                  >
                    {isExporting ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <FiFile />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {showHideColumns && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline'>
                  <FiColumns />
                  Hide columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {table
                  .getAllColumns()
                  .filter((column: any) => column.id !== 'actions')
                  .map((column: any) => (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => {
                        column.toggleVisibility()
                      }}
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : column.id}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table for desktop, Card view for mobile */}
      <div className='hidden w-full overflow-x-auto rounded-lg border md:block'>
        <table className='w-full min-w-full'>
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    className='px-4 py-2 text-left text-muted-foreground font-medium'
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence>
              {table.getRowModel().rows.map((row: any) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className='hover:bg-muted/50 data-[state=selected]:bg-muted'
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td key={cell.id} className='px-4 py-2'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {table.getRowModel().rows.length === 0 && !isLoading && (
          <div className='text-muted-foreground py-8 text-center'>
            No data found.
          </div>
        )}
      </div>

      {/* Card/List view for mobile */}
      <div className='block w-full md:hidden'>
        {table.getRowModel().rows.length === 0 && !isLoading ? (
          <div className='text-muted-foreground py-8 text-center'>
            No data found.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col gap-4'
          >
            <AnimatePresence>
              {table.getRowModel().rows.map((row: any) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className='bg-card hover:bg-muted/50 rounded-lg border p-4 shadow-sm'
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <div
                      key={cell.id}
                      className='flex items-center justify-between py-1'
                    >
                      <span className='text-muted-foreground font-medium'>
                        {typeof cell.column.columnDef.header === 'string'
                          ? cell.column.columnDef.header
                          : cell.column.id}
                      </span>
                      <span className='text-right'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && pagination && data.length > 0 && (
        <div className='flex flex-col items-center justify-between gap-2 px-2 md:flex-row'>
          <div className='text-muted-foreground flex-1 text-sm'>
            Showing {startIdx} to {endIdx} of {totalEntries} entries
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage?.(Math.max(1, page - 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage?.(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage?.(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

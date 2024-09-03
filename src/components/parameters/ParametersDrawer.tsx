import * as React from "react"
import { CustomDrawerContent } from '@/components/ui/CustomDrawer'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronsUpDown, Filter, Star, X, ChevronRight, Box, SquareFunction, CirclePlus, CircleMinus, ListFilter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import parameterConfig from '@/config/parameterConfig.json';
import parameterHierarchy from '@/config/parameterHierarchy.json';
import { CustomDrawerClose } from '@/components/ui/CustomDrawer'
import { useState } from "react"

const parseHierarchy = (hierarchy: any, parent: string = '', level: number = 0): GuitarParam[] => {
  let result: GuitarParam[] = [];
  for (const key in hierarchy) {
    const group: GuitarParam = {
      id: key,
      name: key,
      type: 'group',
      level,
      expanded: true,
      parentGroup: parent,
      starred: false,
      advanced: false,
    };
    result.push(group);
    result = result.concat(parseHierarchy(hierarchy[key], key, level + 1));
  }
  return result;
};

const hierarchyData = parseHierarchy(parameterHierarchy);

const initialData: GuitarParam[] = [
  ...hierarchyData,
  ...parameterConfig.parameters.map(param => ({
    id: param.id,
    name: param.name,
    type: param.component === "General" ? "group" : "param",
    level: param.component.split('.').length - 1,
    expanded: true,
    unit: param.unit || '',
    value: param.defaultValue?.toString() || '',
    description: param.description,
    starred: false,
    parentGroup: param.component.split('.').pop() || '',
    advanced: false,
  }))
];

type GuitarParam = {
  id: string
  name: string
  type: "group" | "param"
  level: number
  expanded: boolean
  unit?: string
  value?: string
  description?: string
  starred: boolean
  parentGroup: string
  advanced: boolean
}

const columns: ColumnDef<GuitarParam>[] = [
  {
    id: "parameter",
    header: "Parameter",
    cell: ({ row }) => {
      const param = row.original
      const toggleExpanded = () => {
        if (param.type === "group") {
          param.expanded = !param.expanded
          // In a real application, you'd update the data source here
        }
      }
      return (
        <div
          className={`flex items-center ${param.type === "group" ? "cursor-pointer font-semibold" : ""}`}
          style={{ paddingLeft: `${param.level * 20}px` }}
          onClick={param.type === "group" ? toggleExpanded : undefined}
        >
          {param.type === "group" && (
            <ChevronRight className={`h-4 w-4 mr-2 transition-transform ${param.expanded ? "transform rotate-90" : ""}`} />
          )}
          {param.type === "group" ? (
            <span className="flex items-center">
              <Box className="h-4 w-4 mr-2" />
              {param.name}
            </span>
          ) : (
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  param.starred = !param.starred
                  // In a real application, you'd update the data source here
                }}
                className="p-0 h-auto mr-2"
              >
                <Star className={`h-4 w-4 ${param.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                <span className="sr-only">{param.starred ? "Unstar" : "Star"} parameter</span>
              </Button>
              <SquareFunction className="h-4 w-4 mr-2" />
              <span>{param.name}</span>
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const param = row.original
      // Remove duplication by splitting the name and taking unique words
      const uniqueWords = Array.from(new Set(param.name.split(' ')))
      const cleanedName = uniqueWords.join(' ')
      return <div>{cleanedName}</div>
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => {
      if (row.original.type === "param") {
        return row.original.unit || (row.original.value && !isNaN(Number(row.original.value)) ? "Num" : "")
      }
      return null
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row, table }) => {
      const param = row.original
      const density = (table.options.meta as { density: string })?.density || "default"
      if (param.type === "param") {
        return (
          <div className="flex justify-end">
            <Input
              placeholder="Enter value"
              value={param.value}
              onChange={(e) => {
                param.value = e.target.value
                // In a real application, you'd update the data source here
              }}
              className={`w-full max-w-[120px] text-right ${
                density === "compact" ? "h-6 text-xs" : 
                density === "comfortable" ? "h-7 text-sm" : 
                "h-8 text-sm"
              }`}
            />
          </div>
        )
      }
      return null
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.type === "param" ? row.original.description : null,
  },
]

const ParametersDrawer: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [density, setDensity] = React.useState<"default" | "comfortable" | "compact">("default")
  const [data, setData] = React.useState<GuitarParam[]>(initialData)
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [dataTypeFilter, setDataTypeFilter] = useState<string>("all")

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced)
    if (!showAdvanced) {
      const newData = [...data]
      parameterConfig.parameters.forEach((param, index) => {
        if (param.component !== "General") {
          newData.splice(index + 1, 0, {
            id: `${param.id}-advanced`,
            name: `Advanced ${param.name}`,
            type: "param",
            level: param.component.split('.').length,
            unit: param.unit,
            value: "",
            description: param.advanced.description,
            starred: false,
            parentGroup: param.component.split('.').pop() || '',
            advanced: true,
            expanded: true,
          })
        }
      })
      setData(newData)
    } else {
      setData(data.filter(param => !param.advanced))
    }
  }

  const handleDataTypeFilterChange = (value: string) => {
    setDataTypeFilter(value)
    // Apply the filter logic here
    const filteredData = initialData.filter(param => {
      if (value === "all") return true
      if (value === "string") return isNaN(Number(param.value))
      if (value === "number") return !isNaN(Number(param.value))
      return true
    })
    setData(filteredData)
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      density,
    },
  })

  return (
    <CustomDrawerContent className="h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] top-16 flex flex-col bg-gray-50">
      <div className="flex flex-col h-full overflow-hidden pr-8 pl-8 pb-8 pt-2">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Parameter Sheet</h2>
          <CustomDrawerClose asChild>
            <Button variant="default" size="sm">
              <X className="h-3 w-3 mr-1" />
              <span className="text-sm">Close</span>
            </Button>
          </CustomDrawerClose>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2 flex-grow">
            <div className="relative w-1/4">
              <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Filter parameters"
                value={(table.getColumn("parameter")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("parameter")?.setFilterValue(event.target.value)
                }
                className="pl-8 pr-4 w-full h-7"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-7 px-2 py-1 text-xs">
                  Data <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel className="text-sm">Filter by Data Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={dataTypeFilter} onValueChange={handleDataTypeFilterChange}>
                  <DropdownMenuRadioItem value="all" className="text-sm">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="string" className="text-sm">String</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="number" className="text-sm">Number</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="flex items-center whitespace-nowrap h-7 px-2 py-1 text-xs" onClick={toggleAdvanced}>
              {showAdvanced ? <CircleMinus className="mr-2 h-4 w-4" /> : <CirclePlus className="mr-2 h-4 w-4" />}
              Advanced
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-7 px-2 py-1 text-xs">
                <ListFilter className="mr-2 h-4 w-4" />
                Density <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-sm">Table Density</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={density} onValueChange={(value: "default" | "comfortable" | "compact") => setDensity(value)}>
                <DropdownMenuRadioItem value="default" className="text-sm">Default</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="comfortable" className="text-sm">Comfortable</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="compact" className="text-sm">Compact</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-grow overflow-hidden rounded-md border bg-white flex flex-col">
          <div className="sticky top-0 z-10 bg-gray-100">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id} 
                        className={`
                          font-semibold text-gray-700 bg-gray-100
                          ${header.id === "parameter" ? "w-[250px] text-left" : 
                            header.id === "name" ? "w-[200px] text-left" :
                            header.id === "unit" ? "w-[80px] text-left" :
                            header.id === "value" ? "w-[150px] text-left pr-4" : 
                            "w-[calc(100%-680px)] text-left"}
                        `}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
          </div>
          <div className="flex-grow overflow-auto">
            <Table>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={`
                        ${density === "compact" ? "h-7" : 
                          density === "comfortable" ? "h-9" : 
                          "h-11"}
                        ${row.original.type === "group" ? "bg-gray-50" : ""}
                        ${row.original.advanced ? "bg-blue-50" : ""}
                        hover:bg-gray-50 transition-colors
                      `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id} 
                          className={`
                            ${cell.column.id === "parameter" ? "w-[250px]" : 
                              cell.column.id === "name" ? "w-[200px]" :
                              cell.column.id === "unit" ? "w-[80px]" :
                              cell.column.id === "value" ? "w-[150px] pr-4" : 
                              "w-[calc(100%-680px)]"}
                            ${density === "compact" ? "py-0.5" : 
                              density === "comfortable" ? "py-1" : 
                              "py-2"}
                          `}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </CustomDrawerContent>
  )
}

export default ParametersDrawer
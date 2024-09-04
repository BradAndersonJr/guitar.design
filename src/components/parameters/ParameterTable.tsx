import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReactTable, ColumnDef, SortingState, ColumnFiltersState, VisibilityState, getCoreRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import ParameterRow from "./ParameterRow";
import ParameterCell from "./ParameterCell";
import parameterConfig from '@/config/parameterConfig.json';
import parameterHierarchy from '@/config/parameterHierarchy.json';

type GuitarParam = {
  id: string;
  name: string;
  type: "group" | "param";
  level: number;
  expanded: boolean;
  unit?: string;
  value?: string;
  description?: string;
  starred: boolean;
  parentGroup: string;
  advanced: boolean;
};

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

const columns: ColumnDef<GuitarParam>[] = [
  {
    id: "parameter",
    header: "Parameter",
    cell: ({ row }) => <ParameterRow param={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const param = row.original;
      const uniqueWords = Array.from(new Set(param.name.split(' ')));
      const cleanedName = uniqueWords.join(' ');
      return <div>{cleanedName}</div>;
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => {
      if (row.original.type === "param") {
        return row.original.unit || (row.original.value && !isNaN(Number(row.original.value)) ? "Num" : "");
      }
      return null;
    },
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row, table }) => {
      const param = row.original;
      const density = (table.options.meta as { density: string })?.density || "default";
      if (param.type === "param") {
        return (
          <ParameterCell
            value={param.value}
            onChange={(value) => {
              param.value = value;
              // In a real application, you'd update the data source here
            }}
            density={density}
          />
        );
      }
      return null;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.type === "param" ? row.original.description : null,
  },
];

const ParameterTable: React.FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [density, setDensity] = React.useState<"default" | "comfortable" | "compact">("default");
  const [data, setData] = React.useState<GuitarParam[]>(initialData);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
    if (!showAdvanced) {
      const newData = [...data];
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
          });
        }
      });
      setData(newData);
    } else {
      setData(data.filter(param => !param.advanced));
    }
  };

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
  });

  return (
    <div className="flex-grow overflow-hidden rounded-md border bg-white flex flex-col">
      <div className="sticky top-0 z-10 bg-gray-100">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className={`font-semibold text-gray-700 bg-gray-100 ${header.id === "parameter" ? "w-[250px] text-left" : header.id === "name" ? "w-[200px] text-left" : header.id === "unit" ? "w-[80px] text-left" : header.id === "value" ? "w-[150px] text-left pr-4" : "w-[calc(100%-680px)] text-left"}`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className={`${
                    density === "compact" ? "h-7" : 
                    density === "comfortable" ? "h-9" : 
                    "h-11"
                  } ${
                    row.original.type === "group" ? "bg-secondary" : ""
                  } ${
                    row.original.advanced ? "bg-blue-50" : ""
                  } hover:bg-secondary transition-colors`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className={`${
                        cell.column.id === "parameter" ? "w-[250px]" : 
                        cell.column.id === "name" ? "w-[200px]" :
                        cell.column.id === "unit" ? "w-[80px]" :
                        cell.column.id === "value" ? "w-[150px] pr-4" : 
                        "w-[calc(100%-680px)]"
                      } ${
                        density === "compact" ? "py-0.5" : 
                        density === "comfortable" ? "py-1" : 
                        "py-2"
                      }`}
                    >
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
  );
};

export default ParameterTable;
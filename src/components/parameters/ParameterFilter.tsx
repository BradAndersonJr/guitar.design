import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, CirclePlus, CircleMinus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface ParameterFilterProps {
  table: any;
  showAdvanced: boolean;
  toggleAdvanced: () => void;
  dataTypeFilter: string;
  handleDataTypeFilterChange: (value: string) => void;
}

const ParameterFilter: React.FC<ParameterFilterProps> = ({
  table,
  showAdvanced,
  toggleAdvanced,
  dataTypeFilter,
  handleDataTypeFilterChange,
}) => {
  return (
    <div className="flex items-center space-x-2 flex-grow">
      <div className="relative w-1/4">
        <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Filter parameters"
          value={(table.getColumn("parameter")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("parameter")?.setFilterValue(event.target.value)
          }
          className="pl-8 pr-4 w-full"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Data <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter by Data Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={dataTypeFilter} onValueChange={handleDataTypeFilterChange}>
            <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="string">String</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="number">Number</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" className="flex items-center whitespace-nowrap" onClick={toggleAdvanced}>
        {showAdvanced ? <CircleMinus className="mr-2 h-4 w-4" /> : <CirclePlus className="mr-2 h-4 w-4" />}
        Advanced
      </Button>
    </div>
  );
};

export default ParameterFilter;
import * as React from "react";
import { Input } from "@/components/ui/input";

type ParameterCellProps = {
  value: string;
  onChange: (value: string) => void;
  density: "default" | "comfortable" | "compact";
};

const ParameterCell: React.FC<ParameterCellProps> = ({ value, onChange, density }) => {
  return (
    <div className="flex justify-end">
      <Input
        placeholder="Enter value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full max-w-[120px] text-right ${
          density === "compact" ? "h-6 text-xs" : 
          density === "comfortable" ? "h-7 text-sm" : 
          "h-8 text-sm"
        }`}
      />
    </div>
  );
};

export default ParameterCell;
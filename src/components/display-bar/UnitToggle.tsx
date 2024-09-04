import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UnitToggleProps {
  unitSystem: string
  handleUnitChange: (value: string) => void
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ unitSystem, handleUnitChange }) => {
  return (
    <Select onValueChange={handleUnitChange} value={unitSystem}>
      <SelectTrigger className="w-[165px] h-7 px-2 py-1 text-xs">
        <span className="text-muted-foreground">Standard: </span>
        <span className="font-medium">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="imperial" className="font-medium">Imperial</SelectItem>
        <SelectItem value="metric" className="font-medium">Metric</SelectItem>
      </SelectContent>
    </Select>
  )
}
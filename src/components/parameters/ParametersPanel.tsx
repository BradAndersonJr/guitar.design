import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { ChevronUp, ChevronDown, Search, X, Sheet } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Drawer, DrawerTrigger } from '@/components/ui/drawer'
import ParametersDrawer from './ParametersDrawer'
import parameterConfig from '@/config/parameterConfig.json'

const initialParameters = parameterConfig.parameters.reduce((acc, param) => {
  acc[param.id] = param.defaultValue
  return acc as Record<string, string | number>
}, {} as Record<string, string | number>)

type ParameterKey = keyof typeof initialParameters

interface ParameterPanelProps {
  isPanelOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onVisibleParametersChange: (params: Array<{id: string, name: string, value: string | number, unit?: string}>) => void;
  unitSystem: string;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({
  isPanelOpen,
  activeTab,
  setActiveTab,
  onVisibleParametersChange,
  unitSystem
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [parameters, setParameters] = useState<Record<ParameterKey, string | number>>(initialParameters)
  const [selectedParameter, setSelectedParameter] = useState<ParameterKey | null>(null)

  useEffect(() => {
    const visibleParams = parameterConfig.parameters
      .filter(param => param.showInBar)
      .map(param => ({
        id: param.id,
        name: param.name,
        value: parameters[param.id as ParameterKey],
        unit: param.unit
      }));
    onVisibleParametersChange(visibleParams);
  }, [parameters, onVisibleParametersChange]);

  const handleIncrement = (id: ParameterKey) => {
    setParameters(prev => ({ ...prev, [id]: String(Number(prev[id]) + 1) }))
  }

  const handleDecrement = (id: ParameterKey) => {
    setParameters(prev => ({ ...prev, [id]: String(Math.max(0, Number(prev[id]) - 1)) }))
  }

  const handleInputChange = (id: ParameterKey, value: string | number) => {
    setParameters(prev => ({ ...prev, [id]: value }))
  }

  const handleParameterChange = (id: ParameterKey, value: string | number) => {
    setParameters(prev => ({ ...prev, [id]: value }))
  }

  const renderParameter = (param: any) => {
    if (param.type === 'number') {
      return (
        <InputWithLabel
          key={param.id}
          label={param.name}
          id={param.id as ParameterKey}
          value={String(parameters[param.id as ParameterKey])}
          onChange={handleInputChange}
          unit={param.unit}
        />
      );
    } else {
      return (
        <DropdownWithLabel
          key={param.id}
          label={param.name}
          id={param.id as ParameterKey}
          value={String(parameters[param.id as ParameterKey])}
          onChange={handleInputChange}
          options={getOptionsForParameter(param.id as ParameterKey)}
        />
      );
    }
  };

  return (
<div 
  className={`absolute top-0 right-0 bottom-0 w-96 bg-white border rounded-lg border-gray-200 transform transition-transform duration-150 ease-out ${
    isPanelOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
      <div className="flex flex-col h-full bg-gray-50 text-gray-900 rounded-lg">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-950">
              Parameter Panel
            </h2>
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 px-2 flex items-center"
                >
                  <Sheet className="w-3 h-3 mr-1" />
                  Full Sheet
                </Button>
              </DrawerTrigger>
              <ParametersDrawer 
                parameters={parameters}
                onParameterChange={handleParameterChange}
              />
            </Drawer>
          </div>
          <Combobox 
            parameters={parameters} 
            onSelect={(key) => setSelectedParameter(key)} 
          />
          {selectedParameter && (
            <div className="mt-2">
              {selectedParameter.includes('type') || selectedParameter.includes('configuration') ? (
                <DropdownWithLabel
                  label={selectedParameter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  id={selectedParameter}
                  value={String(parameters[selectedParameter])}
                  onChange={handleInputChange}
                  options={getOptionsForParameter(selectedParameter)}
                />
              ) : (
                <InputWithLabel
                  label={selectedParameter.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  id={selectedParameter}
                  value={String(parameters[selectedParameter])}
                  onChange={handleInputChange}
                  unit={getUnitForParameter(selectedParameter)}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex justify-center z-10 translate-y-px"> {/* Changed from justify-between to justify-center */}
          <div className="relative flex-1 text-sm max-w-md"> {/* Added max-w-md to limit the width */}
            <div className="flex h-full items-end justify-center gap-2 px-2"> {/* Changed gap-1 to gap-2 for more spacing */}
              <TabButton active={activeTab === "General"} onClick={() => setActiveTab("General")}>
                General
              </TabButton>
              <TabButton active={activeTab === "Fretboard"} onClick={() => setActiveTab("Fretboard")}>
                Fretboard
              </TabButton>
              <TabButton active={activeTab === "Pickups"} onClick={() => setActiveTab("Pickups")}>
                Pickups
              </TabButton>
            </div>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden border-t">
          <div className="absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-white to-transparent" />
          <div className="h-full bg-white p-4 font-mono text-[13px] leading-4 rounded-lg overflow-y-auto">
            {activeTab === "General" && (
              <div className="space-y-4">
                {parameterConfig.parameters
                  .filter(param => param.showInPanel && param.general)
                  .map(renderParameter)}
              </div>
            )}
            {activeTab === "Fretboard" && (
              <div className="space-y-4">
                {parameterConfig.parameters
                  .filter(param => param.showInPanel && param.component === "Neck.Fretboard")
                  .map(renderParameter)}
              </div>
            )}
            {activeTab === "Pickups" && (
              <div className="space-y-4">
                {parameterConfig.parameters
                  .filter(param => param.showInPanel && param.component === "Hardware.Bridge")
                  .map(renderParameter)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Combobox({ parameters, onSelect }: { 
  parameters: Record<string, string | number>;
  onSelect: (key: ParameterKey | null) => void;
}) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [history, setHistory] = useState<ParameterKey[]>([])
  const [selectedParam, setSelectedParam] = useState<ParameterKey | null>(null)

  const parameterList = Object.keys(parameters).map(key => ({
    value: key as ParameterKey,
    label: key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }))

  const filteredParameters = searchTerm
    ? parameterList.filter(param => 
        param.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : history.map(key => parameterList.find(param => param.value === key)!).filter(Boolean)

  const handleSelect = (currentValue: string) => {
    setOpen(false)
    const selectedKey = currentValue as ParameterKey
    setSelectedParam(selectedKey)
    onSelect(selectedKey)
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== currentValue)
      return [selectedKey, ...newHistory].slice(0, 5)
    })
    setSearchTerm("")
  }

  const handleDismiss = () => {
    setSelectedParam(null)
    onSelect(null)
    setSearchTerm("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 text-sm rounded-lg pl-2"
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            {selectedParam ? (
              <span className="flex items-center">
                {selectedParam.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDismiss()
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : (
              <span className="text-gray-500">Search parameters</span>
            )}
          </div>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search parameters" 
            className="h-8 text-sm"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty>No parameter found.</CommandEmpty>
            <CommandGroup>
              {filteredParameters.map((param) => (
                <CommandItem
                  key={param.value}
                  value={param.value}
                  onSelect={handleSelect}
                  className="h-8 text-sm"
                >
                  {param.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      history[0] === param.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`relative h-full whitespace-nowrap rounded-t-lg border border-b-0 px-4 pb-1 pt-1 text-md transition-colors ${
        active 
          ? "bg-white font-bold" 
          : "border-transparent bg-transparent text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      {active && (
        <>
          <div className="absolute bottom-0 right-[-5px] z-20 h-[5px] w-[5px] rounded-bl-[4px] border-b border-l bg-gray-50" />
          <div className="absolute bottom-0 right-[-5px] z-10 h-[5px] w-[5px] bg-white" />
          <div className="absolute bottom-0 left-[-5px] z-20 h-[5px] w-[5px] rounded-br-[4px] border-b border-r bg-gray-50" />
          <div className="absolute bottom-0 left-[-5px] z-10 h-[5px] w-[5px] bg-white" />
        </>
      )}
      {children}
    </button>
  )
}

function InputWithLabel({ label, id, value, onChange, unit }: {
  label: string;
  id: ParameterKey;
  value: string;
  onChange: (id: ParameterKey, value: string | number) => void;
  unit?: string;
}) {
  const handleIncrement = () => {
    onChange(id, String(Number(value) + 1))
  }

  const handleDecrement = () => {
    onChange(id, String(Math.max(0, Number(value) - 1)))
  }

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-base font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative w-40">
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          className="h-9 text-base pr-8 text-right bg-white border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
        />
        {unit ? (
          <span className="absolute right-3 top-[calc(50%+2px)] -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {unit}
          </span>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
            <button 
              className="text-gray-500 hover:text-gray-700 focus:outline-none" 
              onClick={handleIncrement}
              aria-label={`Increase ${label}`}
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button 
              className="text-gray-500 hover:text-gray-700 focus:outline-none" 
              onClick={handleDecrement}
              aria-label={`Decrease ${label}`}
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function DropdownWithLabel({ label, id, value, onChange, options }: {
  label: string;
  id: ParameterKey;
  value: string;
  onChange: (id: ParameterKey, value: string | number) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="text-base font-medium text-gray-700">
        {label}
      </Label>
      <Select value={value} onValueChange={(newValue) => onChange(id, newValue)}>
        <SelectTrigger className="w-40 h-9 text-base bg-white">
          <SelectValue>{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option} className="text-sm">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function getOptionsForParameter(parameter: ParameterKey): string[] {
  const param = parameterConfig.parameters.find(p => p.id === parameter);
  return param && param.options ? param.options : [];
}

function getUnitForParameter(parameter: ParameterKey): string | undefined {
  switch (parameter) {
    case "scale-length":
    case "fretboard-radius":
      return "in";
    case "number-of-frets":
    case "number-of-strings":
      return undefined;
    case "pickup-configuration":
    case "dexterity":
      return undefined;
    default:
      return undefined;
  }
}

export default ParameterPanel
import React from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, SquareMousePointer, TextCursorInput } from 'lucide-react'
import parameterConfig from '@/config/parameterConfig.json'

interface DisplayBarProps {
  unitSystem: string
  handleUnitChange: (value: string) => void
  togglePanel: () => void
  isPanelOpen: boolean
  toggleLayerBrowser: () => void
  isLayerBrowserOpen: boolean
}

const DisplayBar: React.FC<DisplayBarProps> = ({
  unitSystem,
  handleUnitChange,
  togglePanel,
  isPanelOpen,
  toggleLayerBrowser,
  isLayerBrowserOpen,
}) => {
  const barParameters = [
    { id: "scaleLength", label: "Scale Length" },
    { id: "fretboardRadius", label: "Fretboard Radius" },
    { id: "fretCount", label: "Frets" },
    { id: "stringCount", label: "Strings" },
    { id: "dexterity", label: "Dexterity" }
  ]

  return (
    <div className="flex justify-between items-center mb-3 relative">
      {/* Left side */}
      <div className="flex items-center space-x-2">
        <Button variant="default" size="sm" onClick={toggleLayerBrowser} className="h-7 px-2 py-1 text-xs">
          {isLayerBrowserOpen ? "Canvas" : "Layers"}
          {isLayerBrowserOpen ? <SquareMousePointer className="h-3.5 w-3.5 ml-2 transform" /> : <Layers className="h-3.5 w-3.5 ml-2" />}
        </Button>
      </div>

      {/* Center - Parameters */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center bg-secondary rounded-full px-12 py-1.5 w-auto text-sm whitespace-nowrap">
        {barParameters.map((item, index) => {
          if (item.id === "scaleLength") {
            const scaleLengthBass = parameterConfig.parameters.find(p => p.id === "scaleLengthBass")
            const scaleLengthTreb = parameterConfig.parameters.find(p => p.id === "scaleLengthTreb")
            if (!scaleLengthBass || !scaleLengthTreb) return null

            const scaleValue = scaleLengthBass.defaultValue === scaleLengthTreb.defaultValue
              ? `${scaleLengthBass.defaultValue}`
              : `${scaleLengthBass.defaultValue} - ${scaleLengthTreb.defaultValue}`

            return (
              <React.Fragment key={item.id}>
                {index > 0 && <span className="text-muted-foreground mx-1.5">|</span>}
                <span className="text-muted-foreground">{item.label}: </span>
                <span className="font-medium">
                  {scaleValue} {scaleLengthBass.unit}
                </span>
              </React.Fragment>
            )
          }

          if (item.id === "fretboardRadius") {
            const nutRadius = parameterConfig.parameters.find(p => p.id === "nutRadius")
            const heelRadius = parameterConfig.parameters.find(p => p.id === "heelRadius")
            if (!nutRadius || !heelRadius) return null

            return (
              <React.Fragment key={item.id}>
                {index > 0 && <span className="text-muted-foreground mx-1.5">|</span>}
                <span className="text-muted-foreground">{item.label}: </span>
                <span className="font-medium">
                  {nutRadius.defaultValue} - {heelRadius.defaultValue} {nutRadius.unit}
                </span>
              </React.Fragment>
            )
          }

          const param = parameterConfig.parameters.find(p => p.id === item.id)
          if (!param) return null

          return (
            <React.Fragment key={param.id}>
              {index > 0 && <span className="text-muted-foreground mx-1.5">|</span>}
              <span className="text-muted-foreground">{item.label}: </span>
              <span className="font-medium">
                {param.defaultValue}
                {param.unit && ` ${param.unit}`}
              </span>
            </React.Fragment>
          )
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
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
        <Button variant="default" size="sm" onClick={togglePanel} className="h-7 px-2 py-1 text-xs">
          {isPanelOpen ? "Canvas" : "Parameters"}
          {isPanelOpen ? <SquareMousePointer className="h-3.5 w-3.5 ml-2 transform" /> : <TextCursorInput className="h-3.5 w-3.5 ml-2" />}
        </Button>
      </div>
    </div>
  )
}

export default DisplayBar
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MousePointer2, PencilLine, Spline, Undo, Redo, Tangent, PencilRuler, Diameter, Radius } from 'lucide-react'

interface CanvasToolbarProps {
  showRulers: boolean;
  rulerWidth: number;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ showRulers, rulerWidth }) => {
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const topOffset = showRulers ? rulerWidth : 0

  const toolbarItems = [
    { icon: <MousePointer2 className="h-4 w-4" />, label: "Select", canBeActive: true },
    { icon: <PencilLine className="h-4 w-4" />, label: "Line", canBeActive: true },
    { icon: <Spline className="h-4 w-4" />, label: "Spline", canBeActive: true },
    { icon: <Tangent className="h-4 w-4" />, label: "Tangent", canBeActive: true },
    { icon: <PencilRuler className="h-4 w-4" />, label: "Compass", canBeActive: true },
    { icon: <Diameter className="h-4 w-4" />, label: "Diameter", canBeActive: true },
    { icon: <Radius className="h-4 w-4" />, label: "Radius", canBeActive: true },
    { icon: <div className="h-4 w-px bg-gray-300" />, label: "Separator", isSeparator: true },
    { icon: <Undo className="h-4 w-4" />, label: "Undo", canBeActive: false },
    { icon: <Redo className="h-4 w-4" />, label: "Redo", canBeActive: false },
  ]

  const handleButtonClick = (label: string, canBeActive: boolean) => {
    if (canBeActive) {
      setActiveButton(label)
    }
    // Add any other click handling logic here
  }

  return (
    <TooltipProvider>
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 bg-gray-100 rounded-lg p-2 flex items-center space-x-1"
        style={{ top: `${topOffset + 16}px` }}
      >
        {toolbarItems.map((item, index) => 
          item.isSeparator ? (
            <div key={index} className="h-6 w-px bg-gray-300" />
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`hover:bg-gray-200 ${item.canBeActive && activeButton === item.label ? 'bg-gray-200' : ''}`}
                  onClick={() => handleButtonClick(item.label, item.canBeActive)}
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </TooltipProvider>
  )
}

export default CanvasToolbar
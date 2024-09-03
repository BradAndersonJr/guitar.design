import React from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Minus, Plus, Maximize, Focus } from 'lucide-react'

interface CanvasZoomProps {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onCenterView: () => void
  onFocus: () => void
  showRulers: boolean
  rulerWidth: number
}

const CanvasZoom: React.FC<CanvasZoomProps> = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset, 
  onCenterView, 
  onFocus,
  showRulers, 
  rulerWidth 
}) => {
  const leftOffset = showRulers ? rulerWidth : 0

  return (
    <TooltipProvider>
      <div 
        className="absolute bottom-4 flex space-x-2"
        style={{
          left: `${leftOffset + 16}px`,
        }}
      >
        <div className="bg-gray-100 rounded-lg flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-r-none hover:bg-gray-200" onClick={onZoomOut}>
                <Minus className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="hover:bg-gray-200 rounded-none px-0 w-12" onClick={onZoomReset}>
                <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-l-none hover:bg-gray-200" onClick={onZoomIn}>
                <Plus className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="bg-gray-100 rounded-lg flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-r-none hover:bg-gray-200" onClick={onCenterView}>
                <Maximize className="h-4 w-4" />
                <span className="sr-only">Center View</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Center View</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-l-none hover:bg-gray-200" onClick={onFocus}>
                <Focus className="h-4 w-4" />
                <span className="sr-only">Focus</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Focus</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default CanvasZoom
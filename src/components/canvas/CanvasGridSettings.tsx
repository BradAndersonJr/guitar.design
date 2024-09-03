import React from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CanvasGridSettingsProps {
  showGrid: boolean
  setShowGrid: (show: boolean) => void
  showAxes: boolean
  setShowAxes: (show: boolean) => void
  showRulers: boolean
  setShowRulers: (show: boolean) => void
  gridStyle: 'lines' | 'dots'
  setGridStyle: (style: 'lines' | 'dots') => void
  dashedMinorGrid: boolean
  setDashedMinorGrid: (dashed: boolean) => void
}

const CanvasGridSettings: React.FC<CanvasGridSettingsProps> = ({
  showGrid,
  setShowGrid,
  showAxes,
  setShowAxes,
  showRulers,
  setShowRulers,
  gridStyle,
  setGridStyle,
  dashedMinorGrid,
  setDashedMinorGrid
}) => {
  const handleMenuItemClick = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    action()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Grid Settings</span>
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-48" 
            align="end" 
            sideOffset={5}
          >
            <DropdownMenuLabel>Grid Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleMenuItemClick(() => setShowGrid(!showGrid))}>
                {showGrid ? 'Hide Grid' : 'Show Grid'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleMenuItemClick(() => setShowAxes(!showAxes))}>
                {showAxes ? 'Hide Axes' : 'Show Axes'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleMenuItemClick(() => setShowRulers(!showRulers))}>
                {showRulers ? 'Hide Rulers' : 'Show Rulers'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleMenuItemClick(() => setGridStyle(gridStyle === 'lines' ? 'dots' : 'lines'))}>
                Grid Style: {gridStyle === 'lines' ? 'Lines' : 'Dots'}
              </DropdownMenuItem>
              {gridStyle === 'lines' && (
                <DropdownMenuItem onSelect={handleMenuItemClick(() => setDashedMinorGrid(!dashedMinorGrid))}>
                  Minor Grid: {dashedMinorGrid ? 'Dashed' : 'Solid'}
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent>
          <p>Grid Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CanvasGridSettings
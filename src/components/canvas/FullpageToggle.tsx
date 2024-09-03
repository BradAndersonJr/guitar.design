import React from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize, Minimize } from 'lucide-react'

interface FullpageToggleProps {
  isFullPage: boolean
  toggleFullPage: () => void
  showRulers: boolean
  rulerWidth: number
}

const FullpageToggle: React.FC<FullpageToggleProps> = ({ isFullPage, toggleFullPage, showRulers, rulerWidth }) => {
  const topOffset = showRulers ? rulerWidth : 0

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullPage}
            className="absolute right-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
            style={{
              top: `${topOffset + 16}px`,
            }}
          >
            {isFullPage ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            <span className="sr-only">{isFullPage ? 'Minimize' : 'Maximize'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFullPage ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default FullpageToggle
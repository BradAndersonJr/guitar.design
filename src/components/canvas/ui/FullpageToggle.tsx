import React from 'react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Maximize, Minimize, PanelBottom } from 'lucide-react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'

interface FullpageToggleProps {
  isFullPage: boolean
  toggleFullPage: () => void
  showRulers: boolean
  rulerWidth: number
  isSplitView: boolean
  toggleSplitView: () => void
  splitRatio: number
  setSplitRatio: (ratio: number) => void
  children: [React.ReactNode, React.ReactNode];
}

const FullpageToggle: React.FC<FullpageToggleProps> = ({ 
  isFullPage, 
  toggleFullPage, 
  showRulers, 
  rulerWidth,
  isSplitView,
  toggleSplitView,
  splitRatio,
  setSplitRatio,
  children
}) => {
  const topOffset = showRulers ? rulerWidth : 0

  const handleSplitViewToggle = () => {
    if (isSplitView && splitRatio === 1) {
      setSplitRatio(0.60)
    } else {
      toggleSplitView()
    }
  }

  return (
    <>
      <TooltipProvider>
        <div className="absolute right-4 flex space-x-2" style={{ top: `${topOffset + 16}px`, zIndex: 10 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSplitViewToggle}
                className="bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <PanelBottom className="h-4 w-4" />
                <span className="sr-only">Toggle Split View</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSplitView ? 'Exit Split View' : 'Enter Split View'}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullPage}
                className="bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                {isFullPage ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="sr-only">{isFullPage ? 'Minimize' : 'Maximize'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullPage ? 'Exit Fullscreen' : 'Enter Fullscreen'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      {isSplitView ? (
        <ResizablePanelGroup
          direction="vertical"
          onLayout={(sizes) => {
            const topPanelSize = sizes[0];
            if (topPanelSize >= 95) {
              setSplitRatio(1);
            } else if (topPanelSize <= 5) {
              setSplitRatio(0);
            } else {
              setSplitRatio(topPanelSize / 100);
            }
          }}
          className="h-full"
        >
          <ResizablePanel defaultSize={splitRatio * 100} minSize={5}>
            <div className="w-full h-full">{children[0]}</div>
          </ResizablePanel>
          <ResizableHandle withHandle>
            <div className="w-full h-2 bg-gray-200 hover:bg-gray-300 transition-colors cursor-row-resize flex items-center justify-center">
              <div className="w-8 h-1 bg-gray-400 rounded-full" />
            </div>
          </ResizableHandle>
          <ResizablePanel defaultSize={(1 - splitRatio) * 100} minSize={5}>
            <div className="w-full h-full">{children[1]}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="h-full">{children[0]}</div>
      )}
    </>
  )
}

export default FullpageToggle
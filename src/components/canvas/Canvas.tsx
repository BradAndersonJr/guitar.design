import React, { useState, useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import CanvasLanding from './CanvasLanding'
import CanvasViewport from './CanvasViewport'
import { useResizeObserver } from '@/hooks/useResizeObserver'

interface CanvasProps {
  className?: string
  showInitialMenu: boolean
  isPanelOpen?: boolean
  onNewDesign: () => void
}

const Canvas: React.FC<CanvasProps> = ({ 
  className, 
  showInitialMenu,
  isPanelOpen = false,
  onNewDesign
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isFullPage, setIsFullPage] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useResizeObserver(containerRef, (entry) => {
    if (entry) {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    }
  })

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current
      setDimensions({
        width: isPanelOpen && !isFullPage ? clientWidth - 384 : clientWidth,
        height: clientHeight,
      })
    }
  }, [isPanelOpen, isFullPage])

  const toggleFullPage = () => setIsFullPage(!isFullPage)

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative",
        isFullPage ? "fixed inset-0 z-50 bg-white" : "w-full h-full bg-white border border-gray-200 overflow-hidden",
        className
      )}
    >
      {showInitialMenu ? (
        <CanvasLanding onNewDesign={onNewDesign} />
      ) : (
        <CanvasViewport 
          dimensions={dimensions} 
          isPanelOpen={isPanelOpen && !isFullPage} 
          isFullPage={isFullPage}
          toggleFullPage={toggleFullPage}
        />
      )}
    </div>
  )
}

export default Canvas
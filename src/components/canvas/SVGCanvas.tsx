import React, { useState, useEffect, useRef } from 'react'
import { cn } from "@/lib/utils"
import CanvasLanding from './CanvasLanding'
import CanvasDesign from './CanvasDesign'

interface SVGCanvasProps {
  className?: string
  showInitialMenu: boolean
  isPanelOpen?: boolean
  onNewDesign: () => void
}

const SVGCanvas: React.FC<SVGCanvasProps> = ({ 
  className, 
  showInitialMenu,
  isPanelOpen = false,
  onNewDesign
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullPage, setIsFullPage] = useState(false)

  const toggleFullPage = () => {
    setIsFullPage(!isFullPage)
  }

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        setDimensions({
          width: isPanelOpen ? containerWidth - 384 : containerWidth,
          height: containerHeight,
        });
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [isPanelOpen, isFullPage])

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative",
        isFullPage ? "fixed inset-0 z-50 bg-white" : "w-full h-full bg-white border border-gray-200 overflow-hidden",
        className
      )}
    >
      <div className="w-full h-full">
        {showInitialMenu ? (
          <CanvasLanding onNewDesign={onNewDesign} />
        ) : (
          <CanvasDesign 
            dimensions={dimensions} 
            isPanelOpen={isPanelOpen && !isFullPage} 
            isFullPage={isFullPage}
            toggleFullPage={toggleFullPage}
          />
        )}
      </div>
    </div>
  )
}

export default SVGCanvas
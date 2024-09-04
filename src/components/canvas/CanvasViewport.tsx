import React, { useRef, useEffect, useState } from 'react'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import {
  CanvasMenu,
  CanvasZoom,
  CanvasToolbar,
  FullpageToggle,
  CanvasGridSettings
} from './ui'
import { useCanvasState, useCanvasHandlers } from './hooks'
import TopCanvas from './views/TopCanvas'
import SideCanvas from './views/SideCanvas'

const CanvasViewport: React.FC<{ isFullPage: boolean, toggleFullPage: () => void }> = ({ isFullPage, toggleFullPage }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rulerWidth = 20

  const {
    dimensions, setDimensions,
    topPan, setTopPan,
    topZoom, setTopZoom,
    sidePan, setSidePan,
    sideZoom, setSideZoom,
    showGrid, setShowGrid,
    showRulers, setShowRulers,
    gridStyle, setGridStyle,
    dashedMinorGrid, setDashedMinorGrid,
    showAxes, setShowAxes,
    centerView
  } = useCanvasState({ width: 0, height: 0 })

  const topCanvasHandlers = useCanvasHandlers(topPan, setTopPan, topZoom, setTopZoom)
  const sideCanvasHandlers = useCanvasHandlers(sidePan, setSidePan, sideZoom, setSideZoom)

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
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
    }
  }, [isFullPage, setDimensions])

  const [isSplitView, setIsSplitView] = useState(false)
  const [splitRatio, setSplitRatio] = useState(0.75)
  const [isDragging, setIsDragging] = useState(false)

  const toggleSplitView = () => {
    setIsSplitView(!isSplitView)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight
      const newRatio = e.clientY / containerHeight
      setSplitRatio(Math.max(0.1, Math.min(0.9, newRatio)))
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (splitRatio < 0.1) {
      setIsSplitView(false)
    } else if (splitRatio > 0.9) {
      setIsSplitView(false)
      setSplitRatio(0.6) // Reset to default ratio
    }
  }

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullPage ? 'fixed inset-0 z-50 bg-white' : 'w-full h-full'}`}
      style={{ width: '100%', height: '100%' }}
      onMouseMove={handleDrag}
    >
      <FullpageToggle
        isFullPage={isFullPage}
        toggleFullPage={toggleFullPage}
        showRulers={showRulers}
        rulerWidth={rulerWidth}
        isSplitView={isSplitView}
        toggleSplitView={toggleSplitView}
        splitRatio={splitRatio}
        setSplitRatio={setSplitRatio}
      >
        <TopCanvas
          dimensions={isSplitView ? {...dimensions, height: dimensions.height * splitRatio} : dimensions}
          pan={topPan}
          zoom={topZoom}
          showGrid={showGrid}
          showRulers={showRulers}
          gridStyle={gridStyle}
          dashedMinorGrid={dashedMinorGrid}
          showAxes={showAxes}
          handleMouseDown={topCanvasHandlers.handleMouseDown}
          handleMouseMove={topCanvasHandlers.handleMouseMove}
          handleMouseUp={topCanvasHandlers.handleMouseUp}
          handleWheel={topCanvasHandlers.handleWheel}
        />
        {isSplitView && (
          <>
            <div
              className="absolute left-0 right-0 h-2 bg-gray-300 cursor-ns-resize"
              style={{ top: `calc(${splitRatio * 100}% - 1px)` }}
              onMouseDown={handleDragStart}
            />
            <SideCanvas
              dimensions={{...dimensions, height: dimensions.height * (1 - splitRatio)}}
              pan={sidePan}
              zoom={sideZoom}
              showGrid={showGrid}
              showRulers={showRulers}
              gridStyle={gridStyle}
              dashedMinorGrid={dashedMinorGrid}
              showAxes={showAxes}
              handleMouseDown={sideCanvasHandlers.handleMouseDown}
              handleMouseMove={sideCanvasHandlers.handleMouseMove}
              handleMouseUp={sideCanvasHandlers.handleMouseUp}
              handleWheel={sideCanvasHandlers.handleWheel}
            />
          </>
        )}
      </FullpageToggle>
      <CanvasMenu showRulers={showRulers} rulerWidth={rulerWidth} />
      <CanvasToolbar showRulers={showRulers} rulerWidth={rulerWidth} />
      <CanvasZoom
        zoom={topZoom}
        onZoomIn={() => setTopZoom(prevZoom => Math.min(prevZoom * 1.1, 4))}
        onZoomOut={() => setTopZoom(prevZoom => Math.max(prevZoom * 0.9, 0.2))}
        onZoomReset={() => setTopZoom(1)}
        onCenterView={centerView}
        onFocus={() => console.log('Focus button clicked')}
        showRulers={showRulers}
        rulerWidth={rulerWidth}
      />
      <CanvasGridSettings
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showAxes={showAxes}
        setShowAxes={setShowAxes}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        gridStyle={gridStyle}
        setGridStyle={setGridStyle}
        dashedMinorGrid={dashedMinorGrid}
        setDashedMinorGrid={setDashedMinorGrid}
      />
    </div>
  )
}

export default CanvasViewport
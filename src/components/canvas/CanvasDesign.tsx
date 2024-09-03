import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import CanvasMenu from './CanvasMenu'
import CanvasZoom from './CanvasZoom'
import CanvasToolbar from './CanvasToolbar'
import CanvasGridSettings from './CanvasGridSettings'
import FullpageToggle from './FullpageToggle'

const INCH_TO_PIXEL = 96 // Standard 96 DPI
const MIN_GRID_SIZE = 0.125 * INCH_TO_PIXEL // 1/8 inch minimum grid size

const CanvasDesign: React.FC<{ isFullPage: boolean, toggleFullPage: () => void }> = ({ isFullPage, toggleFullPage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [showRulers, setShowRulers] = useState(true)
  const [gridStyle, setGridStyle] = useState<'lines' | 'dots'>('lines')
  const [dashedMinorGrid, setDashedMinorGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const rulerWidth = 20 // Define the width of the ruler

  const centerView = useCallback(() => {
    const rectangleWidth = 40 * INCH_TO_PIXEL
    const rectangleHeight = 13 * INCH_TO_PIXEL
    const centerX = rectangleWidth / 2
    const centerY = 0 // Since the rectangle is centered vertically at y=0

    const newZoom = Math.min(
      dimensions.width / (rectangleWidth * 1.1),
      dimensions.height / (rectangleHeight * 1.1)
    )

    setPan({
      x: dimensions.width / 2 - centerX * newZoom,
      y: dimensions.height / 2 - centerY * newZoom
    })
    setZoom(newZoom)
  }, [dimensions])

  useResizeObserver(containerRef, (entry) => {
    if (entry) {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    }
  })

  // Add this useEffect to update canvas size when isFullPage changes
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      })
    }
  }, [isFullPage])

  useEffect(() => {
    // Center the view only when dimensions are set for the first time
    if (dimensions.width > 0 && dimensions.height > 0 && !isInitialized) {
      centerView()
      setIsInitialized(true)
    }
  }, [dimensions, centerView, isInitialized])

  const getAdaptiveGridSize = useCallback((zoom: number) => {
    const baseGridSize = INCH_TO_PIXEL // 1 inch base grid size
    const zoomLevel = Math.log2(zoom)
    const adaptiveSize = baseGridSize * Math.pow(2, -Math.floor(zoomLevel))
    return Math.max(adaptiveSize, MIN_GRID_SIZE)
  }, [])

  const getAdaptiveRulerInterval = useCallback((zoom: number) => {
    const zoomLevel = Math.log2(zoom)
    const baseInterval = 1 // 1 inch base interval
    return baseInterval * Math.pow(2, Math.floor(-zoomLevel))
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const rulerWidth = showRulers ? 20 : 0

    // Apply pan and zoom transformations
    ctx.save()
    ctx.translate(rulerWidth + pan.x, rulerWidth + pan.y)
    ctx.scale(zoom, zoom)

    // Calculate visible area
    const startX = Math.floor((0 - pan.x) / zoom)
    const startY = Math.floor((0 - pan.y) / zoom)
    const endX = Math.ceil((canvas.width - pan.x) / zoom)
    const endY = Math.ceil((canvas.height - pan.y) / zoom)

    if (showGrid) {
      // Draw adaptive grid
      const gridSize = getAdaptiveGridSize(zoom)
      const subGridSize = gridSize / 4

      const gridStartX = Math.floor(startX / subGridSize) * subGridSize
      const gridStartY = Math.floor(startY / subGridSize) * subGridSize
      const gridEndX = Math.ceil(endX / subGridSize) * subGridSize
      const gridEndY = Math.ceil(endY / subGridSize) * subGridSize

      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 1 / zoom

      if (gridStyle === 'lines') {
        // Draw major grid lines
        ctx.beginPath()
        for (let x = gridStartX; x <= gridEndX; x += subGridSize) {
          const isMajorGridLine = x % gridSize === 0
          if (isMajorGridLine) {
            ctx.moveTo(x, gridStartY)
            ctx.lineTo(x, gridEndY)
          }
        }
        for (let y = gridStartY; y <= gridEndY; y += subGridSize) {
          const isMajorGridLine = y % gridSize === 0
          if (isMajorGridLine) {
            ctx.moveTo(gridStartX, y)
            ctx.lineTo(gridEndX, y)
          }
        }
        ctx.stroke()

        // Draw minor grid lines (dashed)
        ctx.strokeStyle = '#f0f0f0'
        if (dashedMinorGrid) {
          ctx.setLineDash([5 / zoom, 5 / zoom]) // Set dash pattern
        }
        ctx.beginPath()
        for (let x = gridStartX; x <= gridEndX; x += subGridSize) {
          const isMinorGridLine = x % gridSize !== 0
          if (isMinorGridLine) {
            ctx.moveTo(x, gridStartY)
            ctx.lineTo(x, gridEndY)
          }
        }
        for (let y = gridStartY; y <= gridEndY; y += subGridSize) {
          const isMinorGridLine = y % gridSize !== 0
          if (isMinorGridLine) {
            ctx.moveTo(gridStartX, y)
            ctx.lineTo(gridEndX, y)
          }
        }
        ctx.stroke()
        ctx.setLineDash([]) // Reset dash pattern
      } else {
        // Dot style rendering (restored to previous version)
        for (let x = gridStartX; x <= gridEndX; x += subGridSize) {
          for (let y = gridStartY; y <= gridEndY; y += subGridSize) {
            const isMajorGridPoint = (x % gridSize === 0) && (y % gridSize === 0)
            ctx.fillStyle = isMajorGridPoint ? '#e0e0e0' : '#e0e0e0'
            ctx.beginPath()
            ctx.arc(x, y, isMajorGridPoint ? 1 / zoom : 1 / zoom, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }

    // Draw axis lines
    if (showAxes) {
      ctx.lineWidth = 1 / zoom // Thinner line
      
      // Horizontal line (y = 0) - darker red
      ctx.strokeStyle = 'rgba(255, 150, 150, 0.8)'
      ctx.beginPath()
      ctx.moveTo(startX, 0)
      ctx.lineTo(endX, 0)
      ctx.stroke()

      // Vertical line (x = 0) - darker blue
      ctx.strokeStyle = 'rgba(150, 255, 150, 0.8)'
      ctx.beginPath()
      ctx.moveTo(0, startY)
      ctx.lineTo(0, endY)
      ctx.stroke()
    }

    // Draw the black, dashed stroke rectangle
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 0.5 / zoom
    ctx.setLineDash([10 / zoom, 10 / zoom])
    ctx.beginPath()
    ctx.rect(0, -6.5 * INCH_TO_PIXEL, 40 * INCH_TO_PIXEL, 13 * INCH_TO_PIXEL)
    ctx.stroke()
    ctx.setLineDash([]) // Reset line dash

    ctx.restore()

    if (showRulers) {
      // Draw rulers
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, rulerWidth)
      ctx.fillRect(0, 0, rulerWidth, canvas.height)

      ctx.fillStyle = '#333333'
      ctx.font = '10px Arial'

      const rulerInterval = getAdaptiveRulerInterval(zoom)

      const drawRulerMarks = (start: number, end: number, isHorizontal: boolean) => {
        const startInch = Math.floor((-pan[isHorizontal ? 'x' : 'y'] - rulerWidth) / (INCH_TO_PIXEL * zoom))
        const endInch = Math.ceil((end - pan[isHorizontal ? 'x' : 'y'] - rulerWidth) / (INCH_TO_PIXEL * zoom))

        for (let i = startInch; i <= endInch; i += rulerInterval) {
          const pixelPosition = i * INCH_TO_PIXEL * zoom + (isHorizontal ? pan.x : pan.y) + rulerWidth

          if (pixelPosition >= start && pixelPosition <= end) {
            // Major tick
            ctx.beginPath()
            if (isHorizontal) {
              ctx.moveTo(pixelPosition, rulerWidth)
              ctx.lineTo(pixelPosition, rulerWidth * 3 / 4)
            } else {
              ctx.moveTo(rulerWidth, pixelPosition)
              ctx.lineTo(rulerWidth * 3 / 4, pixelPosition)
            }
            ctx.stroke()

            // Label
            let label = i.toFixed(rulerInterval < 1 ? 2 : 0)
            if (!isHorizontal) {
              label = (-i).toFixed(rulerInterval < 1 ? 2 : 0) // Swap negative and positive for vertical ruler
            }
            if (isHorizontal) {
              ctx.textAlign = 'center'
              ctx.textBaseline = 'top'
              ctx.fillText(label, pixelPosition, 2)
            } else {
              ctx.save()
              ctx.translate(rulerWidth / 2, pixelPosition)
              ctx.rotate(-Math.PI / 2)
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillText(label, 0, 0)
              ctx.restore()
            }
          }

          // Minor ticks
          const minorTickCount = 4
          const minorTickInterval = rulerInterval / minorTickCount
          for (let j = 1; j < minorTickCount; j++) {
            const minorPixelPosition = (i + j * minorTickInterval) * INCH_TO_PIXEL * zoom + (isHorizontal ? pan.x : pan.y) + rulerWidth
            if (minorPixelPosition >= start && minorPixelPosition <= end) {
              ctx.beginPath()
              if (isHorizontal) {
                ctx.moveTo(minorPixelPosition, rulerWidth)
                // Make middle hash mark longer
                if (j === 2) {
                  ctx.lineTo(minorPixelPosition, rulerWidth * 13 / 16)
                } else {
                  ctx.lineTo(minorPixelPosition, rulerWidth * 7 / 8)
                }
              } else {
                ctx.moveTo(rulerWidth, minorPixelPosition)
                // Make middle hash mark longer
                if (j === 2) {
                  ctx.lineTo(rulerWidth * 13 / 16, minorPixelPosition)
                } else {
                  ctx.lineTo(rulerWidth * 7 / 8, minorPixelPosition)
                }
              }
              ctx.stroke()
            }
          }
        }
      }

      ctx.strokeStyle = '#333333'
      ctx.lineWidth = 1
      drawRulerMarks(rulerWidth, canvas.width, true)
      drawRulerMarks(rulerWidth, canvas.height, false)

      // Draw ruler border (avoiding the top-left corner)
      ctx.strokeStyle = '#d0d0d0'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(rulerWidth, rulerWidth)
      ctx.lineTo(canvas.width, rulerWidth)
      ctx.moveTo(rulerWidth, rulerWidth)
      ctx.lineTo(rulerWidth, canvas.height)
      ctx.stroke()

      // Draw "in" label in the corner without lines
      ctx.fillStyle = '#333333'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('in', rulerWidth / 2, rulerWidth / 2)
    }
  }, [dimensions, pan, zoom, getAdaptiveGridSize, getAdaptiveRulerInterval, showGrid, showRulers, gridStyle, dashedMinorGrid, showAxes])

  useEffect(() => {
    draw()
  }, [draw])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setLastPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastPosition.x
    const deltaY = e.clientY - lastPosition.y
    setPan(prevPan => ({ x: prevPan.x + deltaX, y: prevPan.y + deltaY }))
    setLastPosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = zoom * zoomFactor

    if (newZoom >= 0.2 && newZoom <= 4) {
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      const mouseX = e.clientX - canvasRect.left
      const mouseY = e.clientY - canvasRect.top

      const newPanX = mouseX - (mouseX - pan.x) * zoomFactor
      const newPanY = mouseY - (mouseY - pan.y) * zoomFactor

      setZoom(newZoom)
      setPan({ x: newPanX, y: newPanY })
    }
  }

  return (
    <div ref={containerRef} className={`relative ${isFullPage ? 'fixed inset-0 z-50 bg-white' : 'w-full h-full'}`} style={{ width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-move"
        style={{ width: '100%', height: '100%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <FullpageToggle
        isFullPage={isFullPage}
        toggleFullPage={toggleFullPage}
        showRulers={showRulers}
        rulerWidth={rulerWidth}
      />
      <CanvasMenu showRulers={showRulers} rulerWidth={rulerWidth} />
      <CanvasToolbar showRulers={showRulers} rulerWidth={rulerWidth} />
      <CanvasZoom
        zoom={zoom}
        onZoomIn={() => setZoom(prevZoom => Math.min(prevZoom * 1.1, 4))}
        onZoomOut={() => setZoom(prevZoom => Math.max(prevZoom * 0.9, 0.2))}
        onZoomReset={() => setZoom(1)}
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

export default CanvasDesign
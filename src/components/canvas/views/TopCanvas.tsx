import React, { useRef, useEffect } from 'react'
import { useCanvasDraw } from '../hooks'

interface TopCanvasProps {
  dimensions: { width: number; height: number }
  pan: { x: number; y: number }
  zoom: number
  showGrid: boolean
  showRulers: boolean
  gridStyle: 'lines' | 'dots'
  dashedMinorGrid: boolean
  showAxes: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void
  handleWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void
}

const TopCanvas: React.FC<TopCanvasProps> = ({
  dimensions,
  pan,
  zoom,
  showGrid,
  showRulers,
  gridStyle,
  dashedMinorGrid,
  showAxes,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleWheel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draw = useCanvasDraw(canvasRef, dimensions, pan, zoom, showGrid, showRulers, gridStyle, dashedMinorGrid, showAxes, true)

  useEffect(() => {
    draw()
  }, [draw])

  return (
    <div className="relative w-full h-full">
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
      <div className="absolute inset-x-0 bottom-2 flex items-center justify-center pointer-events-none">
        <span className="text-gray-400 text-xs font-normal">Top View</span>
      </div>
    </div>
  )
}

export default TopCanvas
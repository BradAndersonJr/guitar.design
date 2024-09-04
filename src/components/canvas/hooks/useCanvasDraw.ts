import { useCallback } from 'react'
import { drawGrid, drawAxes, INCH_TO_PIXEL, drawRulers } from '../utils'
import { GridStyle } from '../types/types'

export const useCanvasDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  dimensions: { width: number; height: number },
  pan: { x: number; y: number },
  zoom: number,
  showGrid: boolean,
  showRulers: boolean,
  gridStyle: GridStyle,
  dashedMinorGrid: boolean,
  showAxes: boolean,
  isTopCanvas: boolean
) => {
  return useCallback(() => {
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
      drawGrid(ctx, startX, startY, endX, endY, zoom, gridStyle, dashedMinorGrid)
    }

    if (showAxes) {
      drawAxes(ctx, startX, startY, endX, endY, zoom)
    }

    // Draw the black, dashed stroke rectangle
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 0.5 / zoom
    ctx.setLineDash([10 / zoom, 10 / zoom])
    ctx.beginPath()
    if (isTopCanvas) {
      ctx.rect(0, -6.5 * INCH_TO_PIXEL, 40 * INCH_TO_PIXEL, 13 * INCH_TO_PIXEL)
    } else {
      ctx.rect(0, 0, 40 * INCH_TO_PIXEL, 2 * INCH_TO_PIXEL)
    }
    ctx.stroke()
    ctx.setLineDash([]) // Reset line dash

    ctx.restore()

    if (showRulers) {
      drawRulers(ctx, canvas.width, canvas.height, pan, zoom, rulerWidth)
    }
  }, [canvasRef, dimensions, pan, zoom, showGrid, showRulers, gridStyle, dashedMinorGrid, showAxes])
}
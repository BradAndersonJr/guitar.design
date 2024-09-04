import { GridStyle } from '../types/types'

export const INCH_TO_PIXEL = 96 // Standard 96 DPI
export const MIN_GRID_SIZE = 0.125 * INCH_TO_PIXEL // 1/8 inch minimum grid size

export const getAdaptiveGridSize = (zoom: number) => {
  const baseGridSize = INCH_TO_PIXEL // 1 inch base grid size
  const zoomLevel = Math.log2(zoom)
  const adaptiveSize = baseGridSize * Math.pow(2, -Math.floor(zoomLevel))
  return Math.max(adaptiveSize, MIN_GRID_SIZE)
}

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  zoom: number,
  gridStyle: GridStyle,
  dashedMinorGrid: boolean
) => {
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
    // Dot style rendering
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

export const drawAxes = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  zoom: number
) => {
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
import { INCH_TO_PIXEL } from './gridUtils'

export const getAdaptiveRulerInterval = (zoom: number) => {
  const zoomLevel = Math.log2(zoom)
  const baseInterval = 1 // 1 inch base interval
  return baseInterval * Math.pow(2, Math.floor(-zoomLevel))
}

export const drawRulers = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  pan: { x: number; y: number },
  zoom: number,
  rulerWidth: number
) => {
  // Draw rulers background
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, canvasWidth, rulerWidth)
  ctx.fillRect(0, 0, rulerWidth, canvasHeight)

  ctx.fillStyle = '#333333'
  ctx.font = '10px Arial'

  const rulerInterval = getAdaptiveRulerInterval(zoom)

  drawRulerMarks(ctx, rulerWidth, canvasWidth, pan.x, zoom, rulerInterval, true)
  drawRulerMarks(ctx, rulerWidth, canvasHeight, pan.y, zoom, rulerInterval, false)

  // Draw ruler border (avoiding the top-left corner)
  ctx.strokeStyle = '#d0d0d0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(rulerWidth, rulerWidth)
  ctx.lineTo(canvasWidth, rulerWidth)
  ctx.moveTo(rulerWidth, rulerWidth)
  ctx.lineTo(rulerWidth, canvasHeight)
  ctx.stroke()

  // Draw "in" label in the corner without lines
  ctx.fillStyle = '#333333'
  ctx.font = 'bold 10px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('in', rulerWidth / 2, rulerWidth / 2)
}

const drawRulerMarks = (
  ctx: CanvasRenderingContext2D,
  start: number,
  end: number,
  pan: number,
  zoom: number,
  rulerInterval: number,
  isHorizontal: boolean
) => {
  const startInch = Math.floor((-pan - start) / (INCH_TO_PIXEL * zoom))
  const endInch = Math.ceil((end - pan - start) / (INCH_TO_PIXEL * zoom))

  for (let i = startInch; i <= endInch; i += rulerInterval) {
    const pixelPosition = i * INCH_TO_PIXEL * zoom + pan + start

    if (pixelPosition >= start && pixelPosition <= end) {
      // Major tick
      ctx.beginPath()
      if (isHorizontal) {
        ctx.moveTo(pixelPosition, start)
        ctx.lineTo(pixelPosition, start * 3 / 4)
      } else {
        ctx.moveTo(start, pixelPosition)
        ctx.lineTo(start * 3 / 4, pixelPosition)
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
        ctx.translate(start / 2, pixelPosition)
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
      const minorPixelPosition = (i + j * minorTickInterval) * INCH_TO_PIXEL * zoom + pan + start
      if (minorPixelPosition >= start && minorPixelPosition <= end) {
        ctx.beginPath()
        if (isHorizontal) {
          ctx.moveTo(minorPixelPosition, start)
          // Make middle hash mark longer
          if (j === 2) {
            ctx.lineTo(minorPixelPosition, start * 13 / 16)
          } else {
            ctx.lineTo(minorPixelPosition, start * 7 / 8)
          }
        } else {
          ctx.moveTo(start, minorPixelPosition)
          // Make middle hash mark longer
          if (j === 2) {
            ctx.lineTo(start * 13 / 16, minorPixelPosition)
          } else {
            ctx.lineTo(start * 7 / 8, minorPixelPosition)
          }
        }
        ctx.stroke()
      }
    }
  }
}
import { useState, useCallback, useEffect } from 'react'
import { INCH_TO_PIXEL } from '../utils'

export const useCanvasState = (initialDimensions: { width: number; height: number }) => {
  const [dimensions, setDimensions] = useState(initialDimensions)
  const [topPan, setTopPan] = useState({ x: 0, y: 0 })
  const [topZoom, setTopZoom] = useState(1)
  const [sidePan, setSidePan] = useState({ x: 0, y: 0 })
  const [sideZoom, setSideZoom] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showRulers, setShowRulers] = useState(true)
  const [gridStyle, setGridStyle] = useState<'lines' | 'dots'>('lines')
  const [dashedMinorGrid, setDashedMinorGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)

  const centerView = useCallback(() => {
    const topRectWidth = 40 * INCH_TO_PIXEL
    const topRectHeight = 13 * INCH_TO_PIXEL
    const sideRectWidth = 40 * INCH_TO_PIXEL
    const sideRectHeight = 2 * INCH_TO_PIXEL

    const topCenterX = topRectWidth / 2
    const topCenterY = topRectHeight / 2 - 6.5 * INCH_TO_PIXEL
    const sideCenterX = sideRectWidth / 2
    const sideCenterY = sideRectHeight / 2

    const topNewZoom = Math.min(
      dimensions.width / (topRectWidth * 1.1),
      dimensions.height / (topRectHeight * 1.1)
    )

    const sideNewZoom = Math.min(
      dimensions.width / (sideRectWidth * 1.1),
      dimensions.height / (sideRectHeight * 1.1)
    )

    setTopPan({
      x: dimensions.width / 2 - topCenterX * topNewZoom,
      y: dimensions.height / 2 - topCenterY * topNewZoom
    })
    setTopZoom(topNewZoom)

    setSidePan({
      x: dimensions.width / 2 - sideCenterX * sideNewZoom,
      y: dimensions.height / 2 - sideCenterY * sideNewZoom
    })
    setSideZoom(sideNewZoom)
  }, [dimensions, setTopPan, setTopZoom, setSidePan, setSideZoom])

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0 && !isInitialized) {
      centerView()
      setIsInitialized(true)
    }
  }, [dimensions, centerView, isInitialized])

  return {
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
  }
}
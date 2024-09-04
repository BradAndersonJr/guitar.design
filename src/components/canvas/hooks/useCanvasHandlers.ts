import { useState, useCallback } from 'react'

interface Pan {
  x: number;
  y: number;
}

export const useCanvasHandlers = (
  pan: Pan,
  setPan: React.Dispatch<React.SetStateAction<Pan>>,
  zoom: number,
  setZoom: React.Dispatch<React.SetStateAction<number>>
) => {
  const [isDragging, setIsDragging] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setLastPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastPosition.x
    const deltaY = e.clientY - lastPosition.y
    setPan(prevPan => ({ x: prevPan.x + deltaX, y: prevPan.y + deltaY }))
    setLastPosition({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastPosition, setPan])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const zoomSensitivity = 0.001
    const zoomFactor = Math.pow(2, -e.deltaY * zoomSensitivity)
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.2), 4)

    if (newZoom !== zoom) {
      const canvasRect = e.currentTarget.getBoundingClientRect()
      const mouseX = e.clientX - canvasRect.left
      const mouseY = e.clientY - canvasRect.top

      const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom)
      const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom)

      setZoom(newZoom)
      setPan({ x: newPanX, y: newPanY })
    }
  }, [zoom, pan, setZoom, setPan])

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel
  }
}
import React from 'react'
import FullpageToggle from './FullpageToggle'
import CanvasMenu from './CanvasMenu'
import CanvasToolbar from './CanvasToolbar'
import CanvasZoom from './CanvasZoom'
import CanvasGridSettings from './CanvasGridSettings'
import { GridStyle } from '../types/types'

interface CanvasUIProps {
  isFullPage: boolean
  toggleFullPage: () => void
  showRulers: boolean
  setShowRulers: React.Dispatch<React.SetStateAction<boolean>>
  zoom: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  centerView: () => void
  showGrid: boolean
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>
  showAxes: boolean
  setShowAxes: React.Dispatch<React.SetStateAction<boolean>>
  gridStyle: GridStyle
  setGridStyle: React.Dispatch<React.SetStateAction<GridStyle>>
  dashedMinorGrid: boolean
  setDashedMinorGrid: React.Dispatch<React.SetStateAction<boolean>>
  isSplitView: boolean
  toggleSplitView: () => void
  splitRatio: number
  setSplitRatio: (ratio: number) => void
}

const CanvasUI: React.FC<CanvasUIProps> = ({
  isFullPage,
  toggleFullPage,
  showRulers,
  setShowRulers,
  zoom,
  setZoom,
  centerView,
  showGrid,
  setShowGrid,
  showAxes,
  setShowAxes,
  gridStyle,
  setGridStyle,
  dashedMinorGrid,
  setDashedMinorGrid,
  isSplitView,
  toggleSplitView,
  splitRatio,
  setSplitRatio,
}) => {
  const rulerWidth = 20

  return (
    <>
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
        {/* Add children here */}
        <div>Canvas Content</div>
        <div>Split View Content</div>
      </FullpageToggle>
      <CanvasMenu showRulers={showRulers} rulerWidth={rulerWidth} />
      <CanvasToolbar showRulers={showRulers} rulerWidth={rulerWidth} />
      <CanvasZoom
        zoom={zoom}
        onZoomIn={() => setZoom((prevZoom) => Math.min(prevZoom * 1.1, 4))}
        onZoomOut={() => setZoom((prevZoom) => Math.max(prevZoom * 0.9, 0.2))}
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
    </>
  )
}

export default CanvasUI

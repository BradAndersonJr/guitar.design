import React from 'react'
import { Button } from '@/components/ui/button'
import { GalleryThumbnails, TextCursorInput } from 'lucide-react'

interface ParameterControlsProps {
  isPanelOpen: boolean
  togglePanel: () => void
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({ isPanelOpen, togglePanel }) => {
  return (
    <Button variant="default" size="sm" onClick={togglePanel} className="h-7 px-2 py-1 text-xs">
      {isPanelOpen ? "Canvas" : "Parameters"}
      {isPanelOpen ? <GalleryThumbnails className="h-3.5 w-3.5 ml-2" /> : <TextCursorInput className="h-3.5 w-3.5 ml-2" />}
    </Button>
  )
}
import React from 'react'
import { Button } from '@/components/ui/button'
import { FilePlus2, FolderOpen, Wand2Icon } from 'lucide-react'
import { useFileImport } from '@/hooks/useFileImport'
import { cn } from "@/lib/utils"
import GridPattern from "@/components/ui/magicui/grid-pattern"

interface CanvasLandingProps {
  onNewDesign: () => void
}

const CanvasLanding: React.FC<CanvasLandingProps> = ({ onNewDesign }) => {
  const { importFile } = useFileImport()

  const handleNewDesign = () => {
    onNewDesign()
  }

  const handleImportDesign = () => {
    importFile()
  }

  return (
    <div className="relative h-full w-full">
      <GridPattern
        width={32}
        height={32}
        x={0}
        y={0}
        strokeDasharray={"4 2"}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "absolute inset-0"
        )}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-64 space-y-4 text-gray-800 rounded-md">
          <div 
            className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-sm cursor-pointer"
            onClick={handleNewDesign}
          >
            <FilePlus2 className="mr-2 h-4 w-4" />
            <span className="flex-grow">New Design</span>
            <span className="text-xs text-gray-500">
              <span className="border px-0.5 rounded text-xs">Ctrl</span>+
              <span className="border px-0.5 rounded text-xs">Alt</span>+
              <span className="border px-0.5 rounded text-xs">N</span>
            </span>
          </div>
          <div 
            className="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 text-sm cursor-pointer"
            onClick={handleImportDesign}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            <span className="flex-grow">Open Design</span>
            <span className="text-xs text-gray-500">
              <span className="border px-0.5 rounded text-xs">Ctrl</span>+
              <span className="border px-0.5 rounded text-xs">Alt</span>+
              <span className="border px-0.5 rounded text-xs">O</span>
            </span>
          </div>
          <div className="px-2">
            <Button className="w-full flex items-center justify-center py-2" variant="ringHover">
              <Wand2Icon className="mr-2 h-4 w-4" />
              Design Wizard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanvasLanding
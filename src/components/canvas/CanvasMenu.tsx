import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, FileIcon, FolderOpen, Save, HelpCircle } from 'lucide-react'

interface CanvasMenuProps {
  showRulers: boolean;
  rulerWidth: number;
}

const CanvasMenu: React.FC<CanvasMenuProps> = ({ showRulers, rulerWidth }) => {
  const topOffset = showRulers ? rulerWidth : 0
  const leftOffset = showRulers ? rulerWidth : 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute z-10 bg-gray-100 hover:bg-gray-200"
          style={{
            top: `${topOffset + 16}px`,
            left: `${leftOffset + 16}px`,
          }}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-48" 
        align="start" 
        sideOffset={5}
        alignOffset={0}
      >
        <DropdownMenuLabel>File</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <FileIcon className="mr-2 h-4 w-4" />
          <span>New</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FolderOpen className="mr-2 h-4 w-4" />
          <span>Open</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Save className="mr-2 h-4 w-4" />
          <span>Save</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CanvasMenu
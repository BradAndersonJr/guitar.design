import React from 'react'
import { Button } from '@/components/ui/button'
import { Files, Share2, Download } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const IconButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="text-center">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const ActionBar: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-white rounded-md shadow-lg px-2 py-2 flex items-center space-x-4 border border-gray-200">
        <TooltipProvider>
          <IconButton icon={<Files className="h-4 w-4" />} label="Reports" />
          <IconButton icon={<Download className="h-4 w-4" />} label="Download" />
          <IconButton icon={<Share2 className="h-4 w-4" />} label="Share" />
        </TooltipProvider>
      </div>
    </div>
  )
}

export default ActionBar
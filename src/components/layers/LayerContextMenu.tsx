import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

type LayerContextMenuProps = {
  x: number
  y: number
  onClose: () => void
  onExpand: () => void
  onCollapse: () => void
}

const LayerContextMenu: React.FC<LayerContextMenuProps> = ({ x, y, onClose, onExpand, onCollapse }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className="absolute bg-white border rounded shadow-lg py-2 z-50"
      style={{ left: x, top: y, width: '128px' }}
    >
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
        onClick={onExpand}
      >
        <ChevronDown className="h-4 w-4 mr-2" />
        Expand
      </button>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
        onClick={onCollapse}
      >
        <ChevronUp className="h-4 w-4 mr-2" />
        Collapse
      </button>
    </motion.div>
  )
}

export default LayerContextMenu
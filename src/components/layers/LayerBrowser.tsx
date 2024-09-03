import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Layers, SquarePen, Eye, EyeOff, Lock, Unlock, ChevronDown, ChevronUp, Palette, View, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type LayerNode = {
  id: string
  name: string
  type: 'group' | 'layer'
  visible: boolean
  locked: boolean
  children?: LayerNode[]
  color?: string
}

const layerStructure: LayerNode = {
  id: 'guitar',
  name: 'Guitar',
  type: 'group',
  visible: true,
  locked: true,
  children: [
    {
      id: 'body',
      name: 'Body',
      type: 'group',
      visible: true,
      locked: true,
      children: [
        { id: 'main-body', name: 'Main Body', type: 'layer', visible: true, locked: true },
        { id: 'cavities', name: 'Cavities', type: 'layer', visible: true, locked: true },
      ],
    },
    {
      id: 'neck',
      name: 'Neck',
      type: 'group',
      visible: true,
      locked: true,
      children: [
        { id: 'fretboard', name: 'Fretboard', type: 'layer', visible: true, locked: true },
        { id: 'frets', name: 'Frets', type: 'layer', visible: true, locked: true },
        { id: 'headstock', name: 'Headstock', type: 'layer', visible: true, locked: true },
      ],
    },
    {
      id: 'hardware',
      name: 'Hardware',
      type: 'group',
      visible: true,
      locked: true,
      children: [
        { id: 'bridge', name: 'Bridge', type: 'layer', visible: true, locked: true },
        { id: 'tuners', name: 'Tuners', type: 'layer', visible: true, locked: true },
      ],
    },
    {
      id: 'electronics',
      name: 'Electronics',
      type: 'group',
      visible: true,
      locked: true,
      children: [
        { id: 'pickups', name: 'Pickups', type: 'layer', visible: true, locked: true },
        { id: 'potentiometers', name: 'Potentiometers', type: 'layer', visible: true, locked: true },
        { id: 'switch', name: 'Switch', type: 'layer', visible: true, locked: true },
      ],
    },
  ],
}

type ContextMenuProps = {
  x: number
  y: number
  onClose: () => void
  onExpand: () => void
  onCollapse: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onExpand, onCollapse }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border rounded shadow-lg py-2 z-50"
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
    </div>
  )
}

type LayerTreeProps = {
  node: LayerNode
  level?: number
  isLast?: boolean
  onContextMenu: (e: React.MouseEvent, node: LayerNode) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
  colorMode: boolean
}

const LayerTree: React.FC<LayerTreeProps> = ({ node, level = 0, isLast = true, onContextMenu, selectedId, onSelect, colorMode }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isVisible, setIsVisible] = useState(node.visible)
  const [isLocked, setIsLocked] = useState(node.locked)

  const isSelected = node.type === 'layer' && selectedId === node.id

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (node.type === 'group') {
      setIsOpen(!isOpen)
    }
  }

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVisible(!isVisible)
  }

  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLocked(!isLocked)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(e, node)
  }

  const handleSelect = () => {
    if (node.type === 'layer') {
      onSelect(selectedId === node.id ? null : node.id)
    }
  }

  return (
    <div className={`relative ${level > 0 ? 'ml-5' : ''}`}>
      {level > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"
          style={{
            left: '-13px',
            height: isLast ? '16px' : '100%',
          }}
        />
      )}
      <div className="relative">
        {level > 0 && (
          <div
            className="absolute w-3 h-px bg-gray-300"
            style={{
              left: '-13px',
              top: '10px',
            }}
          />
        )}
        <motion.div
          className={`flex items-center py-1 px-2 rounded-md hover:bg-gray-100 cursor-pointer
            ${isSelected ? 'bg-blue-100' : ''} ${
            !isLocked ? 'bg-red-100' : ''
          }`}
          onClick={node.type === 'group' ? toggleOpen : handleSelect}
          onContextMenu={handleContextMenu}
          role="button"
          aria-expanded={isOpen}
          tabIndex={0}
        >
          {node.type === 'group' && (
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="mr-1"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          )}
          {node.type === 'group' ? (
            <Layers className="h-4 w-4 mr-2" />
          ) : (
            <SquarePen className="h-4 w-4 mr-2" />
          )}
          <motion.span
            className={`text-base flex-grow ${
              node.type === 'group' ? 'font-bold' : 'font-light'
            } ${
              !isVisible && !isLocked ? 'text-red-400' :
              !isVisible ? 'text-gray-400' :
              !isLocked ? 'text-red-600' : ''
            } ${isSelected ? 'tracking-wide' : ''}`}
            animate={{
              fontWeight: node.type === 'group' ? 700 : (isSelected ? 600 : 300),
              x: isSelected ? 4 : 0
            }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            style={colorMode && node.type === 'layer' ? { color: node.color } : {}}
          >
            {node.name}
          </motion.span>
          <div onClick={(e) => e.stopPropagation()} className="flex items-center">
            <button onClick={toggleVisibility} className="mr-2">
              {isVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button onClick={toggleLock}>
              {isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4 text-red-600" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && node.children && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {node.children.map((childNode, index) => (
              <LayerTree
                key={childNode.id}
                node={childNode}
                level={level + 1}
                isLast={index === node.children!.length - 1}
                onContextMenu={onContextMenu}
                selectedId={selectedId}
                onSelect={onSelect}
                colorMode={colorMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface LayerBrowserProps {
  isOpen: boolean;
}

export default function LayerBrowser({ isOpen }: LayerBrowserProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: LayerNode } | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [colorMode, setColorMode] = useState(false)

  const generateUnsaturatedColor = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 75%, 25%)` // Less saturated, lighter color
  }

  const assignColors = useCallback((node: LayerNode): LayerNode => {
    if (node.type === 'layer') {
      return { ...node, color: generateUnsaturatedColor() }
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(assignColors)
      }
    }
    return node
  }, [])

  const [layers, setLayers] = useState(layerStructure)

  useEffect(() => {
    if (colorMode) {
      setLayers(prevLayers => assignColors({ ...prevLayers }))
    } else {
      setLayers(prevLayers => {
        const removeColors = (node: LayerNode): LayerNode => {
          const { color, ...rest } = node
          if (rest.children) {
            return { ...rest, children: rest.children.map(removeColors) }
          }
          return rest
        }
        return removeColors({ ...prevLayers })
      })
    }
  }, [colorMode, assignColors])

  const handleContextMenu = (e: React.MouseEvent, node: LayerNode) => {
    e.preventDefault()
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        node,
      })
    }
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const expandAll = () => {
    // Implement expand all logic here
    closeContextMenu()
  }

  const collapseAll = () => {
    // Implement collapse all logic here
    closeContextMenu()
  }

  const handleSelect = (id: string | null) => {
    setSelectedId(id)
  }

  const regenerateColors = useCallback(() => {
    setLayers(prevLayers => assignColors({ ...prevLayers }))
  }, [assignColors])

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [contextMenu])

  return (
    <div 
      className={`absolute top-0 left-0 bottom-0 w-80 bg-white border rounded-lg border-gray-200 transform transition-transform duration-150 ease-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full bg-gray-50 text-gray-900 rounded-lg">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-950">Layer Browser</h2>
            <div className="flex items-center space-x-2">
              {colorMode && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs h-7 w-7 px-0 flex items-center justify-center"
                          onClick={regenerateColors}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="z-[9999]">
                      <p>Shuffle Colors</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`text-xs h-7 w-7 px-0 flex items-center justify-center ${colorMode ? 'bg-blue-100' : ''}`}
                      onClick={() => setColorMode(!colorMode)}
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[9999]">
                    <p>Component Color</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7 w-7 px-0 flex items-center justify-center"
                    >
                      <View className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="z-[9999]">
                    <p>Component X-Ray</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden border-t">
          <div className="absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-white to-transparent" />
          <div className="h-full bg-white p-4 font-mono text-[13px] leading-4 rounded-lg overflow-y-auto">
            <LayerTree
              node={layers}
              onContextMenu={handleContextMenu}
              selectedId={selectedId}
              onSelect={handleSelect}
              colorMode={colorMode}
            />
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={closeContextMenu}
                onExpand={expandAll}
                onCollapse={collapseAll}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
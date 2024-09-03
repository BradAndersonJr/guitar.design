import React from 'react'

interface ParameterDisplayProps {
  visibleParameters: Array<{
    id: string
    name: string
    value: string | number
    unit?: string
  }>
}

export const ParameterDisplay: React.FC<ParameterDisplayProps> = ({ visibleParameters }) => {
  const getUnit = (param: string) => {
    const parameter = visibleParameters.find(p => p.id === param)
    return parameter?.unit || ''
  }

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      {visibleParameters.map(({ id, name, value }, index) => (
        <React.Fragment key={id}>
          {index > 0 && <span className="mx-2 text-gray-400">|</span>}
          <span className="font-medium">{name}:</span>
          <span className="ml-1">{value}{getUnit(id) ? ` ${getUnit(id)}` : ''}</span>
        </React.Fragment>
      ))}
    </div>
  )
}
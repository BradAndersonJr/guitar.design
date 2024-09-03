import { useState, useEffect } from 'react'
import parameterConfig from '../config/parameterConfig.json'
import { convertUnit } from '../utils/unitConversion'

export interface Parameter {
  id: string
  name: string
  type: string
  unit?: string
  defaultValue: string | number
  category: string
  showInPanel: boolean
  options?: string[]
}

export function useParameters(unitSystem: string) {
  const [parameters, setParameters] = useState<Parameter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const convertedParameters = parameterConfig.parameters.map(param => {
      if (param.type === 'number' && param.unit) {
        return {
          ...param,
          defaultValue: convertUnit(param.defaultValue as number, param.unit, unitSystem)
        }
      }
      return param
    })
    setParameters(convertedParameters)
    setLoading(false)
  }, [unitSystem])

  const getPanelParameters = () => {
    return parameters.filter(param => param.showInPanel)
  }

  return { parameters, loading, getPanelParameters }
}
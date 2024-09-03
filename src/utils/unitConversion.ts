export function convertUnit(value: number, fromUnit: string, toSystem: string, returnUnitOnly: boolean = false): number | string {
    const metricToImperial: { [key: string]: [number, string] } = {
      'mm': [1 / 25.4, 'in'],
      'cm': [1 / 2.54, 'in'],
      'm': [3.28084, 'ft'],
      'kg': [2.20462, 'lbs'],
      'g': [0.00220462, 'lbs'],
    }
  
    const imperialToMetric: { [key: string]: [number, string] } = {
      'in': [25.4, 'mm'],
      'ft': [0.3048, 'm'],
      'lbs': [0.453592, 'kg'],
    }
  
    if (returnUnitOnly) {
      return toSystem === 'imperial' ? metricToImperial[fromUnit][1] : fromUnit
    }
  
    if (toSystem === 'imperial' && fromUnit in metricToImperial) {
      const [factor, unit] = metricToImperial[fromUnit]
      return Number((value * factor).toFixed(2))
    } else if (toSystem === 'metric' && fromUnit in imperialToMetric) {
      const [factor, unit] = imperialToMetric[fromUnit]
      return Number((value * factor).toFixed(2))
    }
  
    return value
  }
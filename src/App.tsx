import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MainArea } from '@/components/layout/MainArea'
import { ActionBar } from '@/components/action-bar'
import { AlphaWarning } from './components/AlphaWarning';

export default function App() {
  const [showInitialMenu, setShowInitialMenu] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isLayerBrowserOpen, setIsLayerBrowserOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('General')
  const [unitSystem, setUnitSystem] = useState('imperial')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [visibleParameters, setVisibleParameters] = useState<Array<{id: string, name: string, value: string | number, unit?: string}>>([])

  const [parameters, setParameters] = useState<Array<{id: string, name: string, value: string | number, unit?: string}>>([])

  const togglePanel = () => setIsPanelOpen(!isPanelOpen)
  const toggleLayerBrowser = () => setIsLayerBrowserOpen(!isLayerBrowserOpen)

  const handleUnitChange = (value: string) => {
    setUnitSystem(value)
  }

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen)

  const handleVisibleParametersChange = (params: Array<{id: string, name: string, value: string | number, unit?: string}>) => {
    setVisibleParameters(params);
  }

  const handleNewDesign = () => {
    setShowInitialMenu(false)
  }

  const handleParameterChange = (updatedParams: Array<{id: string, name: string, value: string | number, unit?: string}>) => {
    setParameters(updatedParams)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AlphaWarning />
      <Header />
      <div className="flex-1 overflow-hidden px-4">
        <MainArea
          isPanelOpen={isPanelOpen}
          togglePanel={togglePanel}
          unitSystem={unitSystem}
          handleUnitChange={handleUnitChange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleSettings={toggleSettings}
          visibleParameters={visibleParameters}
          onVisibleParametersChange={handleVisibleParametersChange}
          isLayerBrowserOpen={isLayerBrowserOpen}
          toggleLayerBrowser={toggleLayerBrowser}
          showInitialMenu={showInitialMenu}
          onNewDesign={handleNewDesign}
          parameters={parameters}
          onParameterChange={handleParameterChange}
        />
      </div>
      <Footer />
      {!showInitialMenu && <ActionBar />}
    </div>
  )
}
import React from 'react';
import { Canvas } from '@/components/canvas';
import { ParametersPanel } from '@/components/parameters';
import { DisplayBar } from '@/components/display-bar';
import LayerBrowser from '@/components/layers/LayerBrowser';

interface MainAreaProps {
  isPanelOpen: boolean;
  togglePanel: () => void;
  unitSystem: string;
  handleUnitChange: (value: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  visibleParameters: Array<{ id: string; name: string; value: string | number; unit?: string }>;
  onVisibleParametersChange: (params: Array<{ id: string; name: string; value: string | number; unit?: string }>) => void;
  parameters: Record<string, string>;
  onParameterChange: (id: string, value: string) => void;
  isLayerBrowserOpen: boolean;
  toggleLayerBrowser: () => void;
  showInitialMenu: boolean;
  onNewDesign: () => void;
}

const MainArea: React.FC<MainAreaProps> = ({
  isPanelOpen,
  togglePanel,
  unitSystem,
  handleUnitChange,
  activeTab,
  setActiveTab,
  visibleParameters,
  onVisibleParametersChange,
  parameters,
  onParameterChange,
  isLayerBrowserOpen,
  toggleLayerBrowser,
  showInitialMenu,
  onNewDesign,
}) => {
  return (
    <main className="h-full overflow-hidden">
      <div className="h-full flex flex-col bg-gray-50 rounded-lg p-4">
        {!showInitialMenu && (
          <DisplayBar
            isPanelOpen={isPanelOpen}
            togglePanel={togglePanel}
            unitSystem={unitSystem}
            handleUnitChange={handleUnitChange}
            visibleParameters={visibleParameters}
            toggleLayerBrowser={toggleLayerBrowser}
            isLayerBrowserOpen={isLayerBrowserOpen}
          />
        )}
        <div className="flex-1 relative overflow-hidden">
          {!showInitialMenu && (
            <div className={`absolute top-0 left-0 bottom-0 w-80 transition-all duration-150 ease-out ${isLayerBrowserOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <LayerBrowser isOpen={isLayerBrowserOpen} />
            </div>
          )}
          <div className={`absolute inset-0 transition-all duration-150 ease-out ${isPanelOpen ? 'right-[calc(24rem+0.5rem)]' : ''} ${isLayerBrowserOpen ? 'left-[calc(20rem+0.5rem)]' : ''}`}>
            <div className="h-full">
              <Canvas
                className="h-full rounded-lg"
                isPanelOpen={isPanelOpen}
                showInitialMenu={showInitialMenu}
                onNewDesign={onNewDesign}
              />
            </div>
          </div>
          {!showInitialMenu && (
            <div className={`absolute top-0 right-0 bottom-0 w-96 transition-all duration-150 ease-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <ParametersPanel
                isPanelOpen={isPanelOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onVisibleParametersChange={onVisibleParametersChange}
                unitSystem={unitSystem}
                parameters={parameters}
                onParameterChange={onParameterChange}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainArea;
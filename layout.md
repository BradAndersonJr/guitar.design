src/
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── NavigationMenu.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── index.ts
│   │   ├── Footer/
│   │   │   ├── Footer.tsx
│   │   │   ├── SocialLinks.tsx
│   │   │   └── index.ts
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarToggle.tsx
│   │   │   └── index.ts
│   │   └── MainArea/
│   │       ├── MainArea.tsx
│   │       ├── Specifications.tsx
│   │       └── index.ts
│   ├── modals/
│   │   ├── navigation/
│   │   │   ├── IntroductionModal.tsx
│   │   │   ├── GettingStartedModal.tsx
│   │   │   ├── FeaturesModal.tsx
│   │   │   ├── DocumentationModal.tsx
│   │   │   ├── RoadmapModal.tsx
│   │   │   ├── ChangeLogModal.tsx
│   │   │   └── index.ts
│   │   ├── info/
│   │   │   ├── HelpModal.tsx
│   │   │   ├── ShortcutsModal.tsx
│   │   │   ├── PrivacyModal.tsx
│   │   │   ├── SettingsModal.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── action-bar/
│   │   ├── ActionBar.tsx
│   │   ├── Downloads.tsx
│   │   ├── ReportsAction.tsx
│   │   ├── Share.tsx
│   │   └── index.ts
│   ├── reports/
│   │   ├── ReportsDrawer.tsx
│   │   ├── ReportTabs.tsx
│   │   ├── reports/
│   │   │   ├── FretCalculationsReport.tsx
│   │   │   ├── MathematicalFormulasReport.tsx
│   │   │   ├── StringTensionReport.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── layers/
│   │   ├── LayerBrowser.tsx
│   │   ├── LayerVisibilityControl.tsx
│   │   ├── LayerContextMenu.tsx
│   │   └── index.ts
│   ├── canvas/
│   │   ├── SVGCanvas.tsx
│   │   ├── CanvasToolbar.tsx
│   │   ├── CanvasResize.tsx
│   │   ├── CanvasLanding.tsx
│   │   ├── GridSettings.tsx
│   │   ├── DesignWizard.tsx
│   │   └── index.ts
│   ├── parameter-bar/
│   │   ├── ParameterBar.tsx
│   │   ├── ParameterDisplay.tsx
│   │   ├── UnitToggle.tsx
│   │   ├── ParameterControls.tsx
│   │   └── index.ts
│   ├── parameters/
│   │   ├── ParametersPanel.tsx
│   │   ├── ParameterInput.tsx
│   │   ├── ParametersModal.tsx
│   │   ├── Parameters.json
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── ... (other reusable UI components)
├── hooks/
│   ├── useGuitarState.ts
│   ├── useCanvas.ts
│   └── useParameters.ts
├── context/
│   ├── GuitarContext.tsx
│   └── ThemeContext.tsx
├── utils/
│   ├── guitarCalculations.ts
│   ├── svgHelpers.ts
│   └── formatters.ts
├── types/
│   ├── guitar.ts
│   └── parameters.ts
├── constants/
│   └── guitarParts.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
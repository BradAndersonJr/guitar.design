Main Wrapper #Canvas.tsx
│
├── Front View Canvas #FrontViewCanvas.tsx
│   │
│   ├── Background Layer #Grid.tsx
│   │   └── Grid
│   │
│   ├── Ruler Layer #Ruler.tsx
│   │
│   └── Main Content Layer
│       ├── Shapes
│       ├── Images
│       └── Text
│
├── Side View Canvas #SideViewCanvas.tsx
│   │
│   ├── Background Layer #Grid.tsx
│   │   └── Grid 
│   │
│   ├── Ruler Layer #Ruler.tsx
│   │
│   └── Main Content Layer
│       ├── Shapes
│       ├── Images
│       └── Text
│
├── Shared Interaction Layer
│   ├── Buttons
│   └── Clickable areas
│
└── Shared Overlay Layer
    ├── UI elements
    └── Tooltips

canvas/

Desired Structure

├── components/
│   ├── Grid.tsx
│   ├── Ruler.tsx
├── layers/
│   ├── SharedInteractionLayer.tsx
│   └── SharedOverlayLayer.tsx
├── ui/
│   ├── CanvasGridSettings.tsx
│   ├── CanvasMenu.tsx
│   ├── CanvasToolbar.tsx
│   ├── CanvasZoom.tsx
│   └── FullpageToggle.tsx
├── utils/
│   └── canvasHelpers.ts
├── views/
│   ├── FrontViewCanvas.tsx
│   ├── SideViewCanvas.tsx

Old Files

├── Canvas.tsx
├── CanvasDesign.tsx
├── CanvasGridSettings.tsx
├── CanvasLanding.tsx
├── CanvasMenu.tsx
├── CanvasToolbar.tsx
├── CanvasZoom.tsx
├── DesignWizard.tsx
├── FullpageToggle.tsx
└── index.ts
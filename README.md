# MathView

MathView 
MathView is a modular, p5.js-powered engine for interactive mathematical visualizations. It allows me to create "Visual" modules that automatically generate UI controls for real-time parameter change.

How it Works
The app uses a central engine (script.js) that handles the p5.js canvas and sidebar navigation. Each mathematical concept is encapsulated in a class extending the Visual base class.

Every visual module follows this structure:

  params: State variables (slope, amplitude, color, etc.) that update the drawing.

  paramDefs: A declarative way to generate sliders, toggles, and color pickers in the sidebar.

  draw(): The standard p5.js drawing loop, localized to the component.

Most Controls are visual specific, but a few global controls are "R" for reset visual, and UP and DOWN arrow for zooming in and out. (The Zoom function will change the pixels per unit value which could affect the visual)

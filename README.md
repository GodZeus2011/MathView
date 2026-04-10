# MathView

MathView 📐
MathView is a modular, p5.js-powered engine for interactive mathematical visualizations. It allows developers to create "Visual" modules that automatically generate UI controls for real-time parameter manipulation.

🚀 How it Works
The app uses a central engine (script.js) that handles the p5.js canvas and sidebar navigation. Each mathematical concept is encapsulated in a class extending the Visual base class.

🧩 The "Visual" Architecture
Every visual module follows this structure:

params: State variables (slope, amplitude, color, etc.) that update the drawing.

paramDefs: A declarative way to generate sliders, toggles, and color pickers in the sidebar.

draw(): The standard p5.js drawing loop, localized to the component.


This is a solid foundation for a math visualization engine! You’ve built a clean, modular system using a class-based architecture that makes it very easy to plug in new "Visuals."

I've reviewed your files. Here is an updated README.md tailored to your actual code structure, followed by some technical observations and a "Pro-Tip" for your math logic.

MathView 📐
MathView is a modular, p5.js-powered engine for interactive mathematical visualizations. It allows developers to create "Visual" modules that automatically generate UI controls for real-time parameter manipulation.

🚀 How it Works
The app uses a central engine (script.js) that handles the p5.js canvas and sidebar navigation. Each mathematical concept is encapsulated in a class extending the Visual base class.

🧩 The "Visual" Architecture
Every visual module follows this structure:

params: State variables (slope, amplitude, color, etc.) that update the drawing.

paramDefs: A declarative way to generate sliders, toggles, and color pickers in the sidebar.

draw(): The standard p5.js drawing loop, localized to the component.

✨ Current Visuals

Beginner Category
Simple Line / Circle Demo: Basic geometry and input handling.

Linear Function Graph: Interactive y=mx+b visualization with a coordinate grid.

Quadratic Function Graph: Supports Standard, Vertex, and Factored forms with real-time formula rendering.

Trigonometric Graph: Sine, Cosine, and Tangent waves with adjustable amplitude, frequency, and phase shift.

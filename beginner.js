class SimpleLineCircleDemo extends Visual {
    constructor() {
        super({
            id: "simple-line-circle-demo",
            name: "Simple Line / Circle Demo",
            category: "Beginner",
            description: "Switch between a centered circle and a centered line."
        });

        this.defaultParams = {
            shape: "Circle",
            size: 150,
            strokeWeight: 3,
            strokeColor: "#3366ff",
            fillEnabled: true,
            fillColor: "#99bbff"
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Shape" },
            { type: "select", key: "shape", label: "Shape Type", options: ["Circle", "Line"] },

            { type: "section", label: "Geometry" },
            { type: "slider", key: "size", label: "Size", min: 20, max: 400, step: 1 },
            { type: "slider", key: "strokeWeight", label: "Stroke Weight", min: 1, max: 20, step: 1 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "strokeColor", label: "Stroke Color" },
            { type: "toggle", key: "fillEnabled", label: "Fill Enabled", help: "Only affects the circle." },
            { type: "color", key: "fillColor", label: "Fill Color" },

            { type: "section", label: "Actions" },
            { type: "button", label: "Reset", action: "resetParams" }
        ];
    }

    draw() {
        const cx = width / 2;
        const cy = height / 2;

        stroke(this.params.strokeColor);
        strokeWeight(this.params.strokeWeight);

        if (this.params.shape === "Circle") {
            if (this.params.fillEnabled) fill(this.params.fillColor);
            else noFill();
            circle(cx, cy, this.params.size);
        } else {
            noFill();
            line(cx - this.params.size / 2, cy, cx + this.params.size / 2, cy);
        }
    }

    mouseWheel(event) {
        const newSize = constrain(this.params.size - event.delta * 0.1, 20, 400);
        this.setParam("size", newSize, { controls: true });
        return false;
    }

    keyPressed() {
        if (key === "c" || key === "C") this.setParam("shape", "Circle", { controls: true });
        if (key === "l" || key === "L") this.setParam("shape", "Line", { controls: true });
        if (key === "r" || key === "R") this.resetParams();
    }
}
registerVisual(new SimpleLineCircleDemo());

//GRAPHS

class LinearFunctionGraph extends Visual {
    constructor() {
        super({
            id: "linear-function-graph",
            name: "Linear Function Graph",
            category: "Beginner",
            description: "Visualize y = mx + b with a fixed coordinate system."
        });

        this.defaultParams = {
            m: 1, b: 0,
            lineColor: "#e91e63", lineWeight: 3,
            showAxes: true, axesColor: "#333333",
            showGrid: true, gridColor: "#dddddd"
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Function (y = mx + b)" },
            {
                type: "slider",
                key: "m",
                label: "Slope (m)",
                min: -5,
                max: 5,
                step: 0.1
            },
            {
                type: "slider",
                key: "b",
                label: "Y-Intercept (b)",
                min: -300,
                max: 300,
                step: 20
            },
            { type: "section", label: "Appearance" },
            { type: "slider", key: "lineWeight", label: "Thickness", min: 1, max: 5, step: 1 },
            { type: "color", key: "lineColor", label: "Line Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" },
            { type: "section", label: "Actions" },
            { type: "button", label: "Reset", action: "resetParams" }
        ];
    }

    draw() {
        push();
        translate(width / 2, height / 2);
        scale(1, -1); 

        if (this.params.showGrid) {
            this.drawGrid();
        }

        this.drawAxes();
        this.drawFunction();
        pop();
    }

    drawGrid() {
        stroke(this.params.gridColor);
        strokeWeight(0.5);
        const spacing = 20; 

        for (let x = spacing; x < width / 2; x += spacing) {
            line(x, -height / 2, x, height / 2);
            line(-x, -height / 2, -x, height / 2);
        }
        for (let y = spacing; y < height / 2; y += spacing) {
            line(-width / 2, y, width / 2, y);
            line(-width / 2, -y, width / 2, -y);
        }
    }

    drawAxes() {
        stroke(this.params.axesColor);
        strokeWeight(1.5);
        line(-width / 2, 0, width / 2, 0);
        line(0, -height / 2, 0, height / 2);
    }

    drawFunction() {
        const { m, b, lineColor, lineWeight } = this.params;
        noFill();
        stroke(lineColor);
        strokeWeight(lineWeight);

        let x1 = -width / 2;
        let y1 = m * x1 + b;
        let x2 = width / 2;
        let y2 = m * x2 + b;
        line(x1, y1, x2, y2);
    }

    keyPressed() {
        if (key === 'r' || key === 'R') {
            this.resetParams();
        }
    }
}
registerVisual(new LinearFunctionGraph());

class QuadraticFunctionGraph extends Visual {
    constructor() {
        super({
            id: "quadratic-function-graph",
            name: "Quadratic Function Graph",
            category: "Beginner",
            description: "1 Unit = 20 Pixels. Explore Standard, Vertex, and Factored forms."
        });

        this.defaultParams = {
            form: "Standard",
            ppu: 20, 
            a: 1.0, b: 0.0, c: 0.0,
            h: 0.0, k: 0.0,
            r1: -2.0, r2: 2.0,
            lineColor: "#4caf50", lineWeight: 3,
            showAxes: true, showGrid: true,
            gridColor: "#e0e0e0"
        };

        this.params = { ...this.defaultParams };
    }

    getParamDefs() {
        let defs = [
            { type: "section", label: "Algebraic Form" },
            {
                type: "select",
                key: "form",
                label: "Equation Form",
                options: ["Standard", "Vertex", "Factored"]
            },
            { type: "section", label: "Coefficients (Units)" },
            {
                type: "slider", 
                key: "a", 
                label: "a (Curvature)",
                min: -10, 
                max: 10, 
                step: 0.1
            }
        ];

        if (this.params.form === "Standard") {
            defs.push({ type: "slider", key: "b", label: "b (Linear)", min: -10, max: 10, step: 0.1 });
            defs.push({ type: "slider", key: "c", label: "c (Y-Int)", min: -15, max: 15, step: 0.1 });
        } 
        else if (this.params.form === "Vertex") {
            defs.push({ type: "slider", key: "h", label: "h (Horiz Shift)", min: -20, max: 20, step: 0.1 });
            defs.push({ type: "slider", key: "k", label: "k (Vert Shift)", min: -15, max: 15, step: 0.1 });
        } 
        else if (this.params.form === "Factored") {
            defs.push({ type: "slider", key: "r1", label: "r1 (Root 1)", min: -20, max: 20, step: 0.1 });
            defs.push({ type: "slider", key: "r2", label: "r2 (Root 2)", min: -20, max: 20, step: 0.1 });
        }

        defs.push(
            { type: "section", label: "Appearance" },
            { type: "slider", key: "lineWeight", label: "Thickness", min: 1, max: 10, step: 1 },
            { type: "color", key: "lineColor", label: "Line Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" },
            { type: "button", label: "Reset", action: "resetParams" }
        );

        return defs;
    }

    onParamChange(key, value) {
        if (key === "form") {
            updateUI({ controls: true });
        }
    }

    draw() {
        push();
        translate(width / 2, height / 2);
        scale(1, -1); 

        if (this.params.showGrid) this.drawGrid();
        if (this.params.showAxes) this.drawAxes();

        this.drawParabola();
        pop();

        this.drawFormulaLabel();
    }

    drawGrid() {
        stroke(this.params.gridColor || "#e0e0e0");
        strokeWeight(0.5);
        const spacing = this.params.ppu;

        for (let x = -width / 2; x <= width / 2; x += spacing) line(x, -height / 2, x, height / 2);
        for (let y = -height / 2; y <= height / 2; y += spacing) line(-width / 2, y, width / 2, y);
    }

    drawAxes() {
        stroke("#333333");
        strokeWeight(1.5);
        line(-width / 2, 0, width / 2, 0);
        line(0, -height / 2, 0, height / 2);
    }

    drawParabola() {
        const p = this.params;
        const ppu = p.ppu || 20;
        
        noFill();
        stroke(p.lineColor || "#000");
        strokeWeight(p.lineWeight || 1);

        beginShape();
        for (let sx = -width / 2; sx <= width / 2; sx += 1) {
            let x = sx / ppu; 
            let y = 0;

            if (p.form === "Standard") {
                y = p.a * (x * x) + p.b * x + p.c;
            } 
            else if (p.form === "Vertex") {
                y = p.a * Math.pow(x - p.h, 2) + p.k;
            } 
            else if (p.form === "Factored") {
                y = p.a * (x - p.r1) * (x - p.r2);
            }

            let sy = y * ppu;

            if (sy > -height && sy < height) {
                vertex(sx, sy);
            } else {
                endShape();
                beginShape();
            }
        }
        endShape();
    }

    fmt(num) {
        let val = parseFloat(num).toFixed(2);
        return val.endsWith('.00') ? val.slice(0, -3) : val;
    }

    drawFormulaLabel() {
        const p = this.params;
        fill(30);
        noStroke();
        textSize(18);
        textAlign(LEFT, TOP);

        let eq = "y = ";
        const a = this.fmt(p.a);

        if (p.form === "Standard") {
            const b = parseFloat(p.b);
            const c = parseFloat(p.c);
            const bStr = b >= 0 ? ` + ${this.fmt(b)}` : ` - ${this.fmt(Math.abs(b))}`;
            const cStr = c >= 0 ? ` + ${this.fmt(c)}` : ` - ${this.fmt(Math.abs(c))}`;
            eq += `${a}x²${bStr}x${cStr}`;
        } 
        else if (p.form === "Vertex") {
            const h = parseFloat(p.h);
            const k = parseFloat(p.k);
            const hStr = h >= 0 ? ` - ${this.fmt(h)}` : ` + ${this.fmt(Math.abs(h))}`;
            const kStr = k >= 0 ? ` + ${this.fmt(k)}` : ` - ${this.fmt(Math.abs(k))}`;
            eq += `${a}(x${hStr})²${kStr}`;
        } 
        else if (p.form === "Factored") {
            const r1 = parseFloat(p.r1);
            const r2 = parseFloat(p.r2);
            const r1Str = r1 >= 0 ? ` - ${this.fmt(r1)}` : ` + ${this.fmt(Math.abs(r1))}`;
            const r2Str = r2 >= 0 ? ` - ${this.fmt(r2)}` : ` + ${this.fmt(Math.abs(r2))}`;
            eq += `${a}(x${r1Str})(x${r2Str})`;
        }

        text(eq, 20, 20);
        
        textSize(12);
        fill(100);
    }

    keyPressed() {
        if (key === 'r' || key === 'R') this.resetParams();
    }
}
registerVisual(new QuadraticFunctionGraph());

class TrigFunctionGraph extends Visual {
    constructor() {
        super({
            id: "trig-function-graph",
            name: "Trigonometric Graph",
            category: "Beginner",
            description: "High-precision trig grapher with expanded slider ranges to cover the full canvas."
        });

        this.defaultParams = {
            funcType: "Sine",
            ppu: 20,           
            amplitude: 2.0,    
            frequency: 1.0,    
            phaseShift: 0.0,   
            verticalShift: 0.0, 
            lineColor: "#2196f3",
            lineWeight: 3,
            showAxes: true,
            showGrid: true,
            gridColor: "#e0e0e0"
        };

        this.params = { ...this.defaultParams };
    }

    getParamDefs() {
        return [
            { type: "section", label: "Function Type" },
            {
                type: "select",
                key: "funcType",
                label: "Trig Function",
                options: ["Sine", "Cosine", "Tangent"]
            },
            { type: "section", label: "Parameters (Units)" },
            { 
                type: "slider", 
                key: "amplitude", 
                label: "Amplitude (A)", 
                min: 0, 
                max: 15, 
                step: 0.1 
            },
            { 
                type: "slider", 
                key: "frequency", 
                label: "Frequency (B)", 
                min: 0, 
                max: 5,
                step: 1 
            },
            { 
                type: "slider", 
                key: "phaseShift", 
                label: "Phase Shift (C)", 
                min: -20, 
                max: 20,  
                step: 0.1 
            },
            { 
                type: "slider", 
                key: "verticalShift", 
                label: "Vertical Shift (D)", 
                min: -15, 
                max: 15,  
                step: 0.1 
            },
            { type: "section", label: "Appearance" },
            { type: "color", key: "lineColor", label: "Line Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" },
            { type: "button", label: "Reset", action: "resetParams" }
        ];
    }

    draw() {
        push();
        translate(width / 2, height / 2);
        scale(1, -1);

        if (this.params.showGrid) this.drawGrid();
        if (this.params.showAxes) this.drawAxes();

        this.drawTrigWave();
        pop();

        this.drawFormulaLabel();
    }

    drawGrid() {
        stroke(this.params.gridColor || "#e0e0e0");
        strokeWeight(0.5);
        const spacing = this.params.ppu;
        for (let x = -width / 2; x <= width / 2; x += spacing) line(x, -height / 2, x, height / 2);
        for (let y = -height / 2; y <= height / 2; y += spacing) line(-width / 2, y, width / 2, y);
    }

    drawAxes() {
        stroke("#333333");
        strokeWeight(1.5);
        line(-width / 2, 0, width / 2, 0);
        line(0, -height / 2, 0, height / 2);
    }

    drawTrigWave() {
        const p = this.params;
        const ppu = p.ppu || 20;
        const canvasLimit = height / 2;

        noFill();
        stroke(p.lineColor || "#000");
        strokeWeight(p.lineWeight || 1);

        let prevSY = null;

        beginShape();
        for (let sx = -width / 2; sx <= width / 2; sx += 1) {
            let x = sx / ppu;
            let angle = p.frequency * (x - p.phaseShift);
            
            let y = 0;
            if (p.funcType === "Sine") {
                y = p.amplitude * Math.sin(angle) + p.verticalShift;
            } else if (p.funcType === "Cosine") {
                y = p.amplitude * Math.cos(angle) + p.verticalShift;
            } else if (p.funcType === "Tangent") {
                y = p.amplitude * Math.tan(angle) + p.verticalShift;
            }

            let sy = y * ppu;

            if (prevSY !== null) {
                if (Math.abs(sy - prevSY) > height) {
                    
                    if (sy > prevSY) vertex(sx - 1, canvasLimit + 100);
                    else vertex(sx - 1, -canvasLimit - 100);
                    
                    endShape();
                    beginShape();

                    if (sy > prevSY) vertex(sx, -canvasLimit - 100);
                    else vertex(sx, canvasLimit + 100);
                }
            }

            let drawSY = constrain(sy, -canvasLimit * 5, canvasLimit * 5);
            vertex(sx, drawSY);

            prevSY = drawSY;
        }
        endShape();
    }

    fmt(num) {
        let val = parseFloat(num).toFixed(2);
        return val.endsWith('.00') ? val.slice(0, -3) : val;
    }

    drawFormulaLabel() {
        const p = this.params;
        fill(30);
        noStroke();
        textSize(18);
        textAlign(LEFT, TOP);

        const fName = p.funcType.toLowerCase();
        const a = this.fmt(p.amplitude);
        const b = this.fmt(p.frequency);
        const c = parseFloat(p.phaseShift);
        const d = parseFloat(p.verticalShift);

        const cStr = c >= 0 ? ` - ${this.fmt(c)}` : ` + ${this.fmt(Math.abs(c))}`;
        const dStr = d >= 0 ? ` + ${this.fmt(d)}` : ` - ${this.fmt(Math.abs(d))}`;

        let eq = `y = ${a} ${fName}(${b}(x${cStr}))${dStr}`;
        
        text(eq, 20, 20);
        
        textSize(12);
        fill(100);
    }

    keyPressed() {
        if (key === 'r' || key === 'R') this.resetParams();
    }
}
registerVisual(new TrigFunctionGraph());
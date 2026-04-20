class SimpleLineCircleDemo extends Visual {
    constructor() {
        super({
            id: "simple-line-circle-demo",
            name: "Simple Line / Circle Demo",
            category: "Beginner",
            description: "Switch between a centered circle and a centered line. Scroll to Zoom."
        });

        this.defaultParams = {
            ppu: 20,           
            shape: "Circle",
            size: 8,              
            strokeWeight: 0.15, 
            strokeColor: "#3366ff",
            fillEnabled: true,
            fillColor: "#99bbff"
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Shape Logic" },
            { type: "select", key: "shape", label: "Shape Type", options: ["Circle", "Line"] },
            { type: "slider", key: "size", label: "Size (Units)", min: 1, max: 40, step: 1 },

            { type: "section", label: "Appearance" },
            { type: "slider", key: "strokeWeight", label: "Thickness (Units)", min: 0.01, max: 0.5, step: 0.01 },
            { type: "color", key: "strokeColor", label: "Stroke Color" },
            { type: "toggle", key: "fillEnabled", label: "Fill Enabled" },
            { type: "color", key: "fillColor", label: "Fill Color" }
        ];
    }

    draw() {
        push();
        this.setupCanvas(); 
        
        this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawMainShape();
        pop();

        this.drawHUD([
            `Shape: ${this.params.shape}`,
            `Size: ${this.params.size} Units`,
            `Thickness: ${this.params.strokeWeight} Units`,
            `Zoom: ${this.params.ppu.toFixed(1)} px/unit`
        ]);
    }

    drawMainShape() {
        stroke(this.params.strokeColor);
        
        strokeWeight(this.params.strokeWeight * this.params.ppu);
        
        const s_px = this.params.size * this.params.ppu;

        if (this.params.shape === "Circle") {
            if (this.params.fillEnabled) fill(this.params.fillColor);
            else noFill();
            circle(0, 0, s_px * 2);
        } else {
            noFill();
            line(-s_px, 0, s_px, 0);
        }
    }

    keyPressed() {
        if (key === "c" || key === "C") this.setParam("shape", "Circle", { controls: true });
        if (key === "l" || key === "L") this.setParam("shape", "Line", { controls: true });
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
            description: "Visualize y = mx + b using standard mathematical coordinates."
        });

        this.defaultParams = {
            ppu: 20, 
            m: 1.0, 
            b: 0.0, 
            lineColor: "#e91e63", 
            lineWeight: 0.25,
            showGrid: true,
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Function (y = mx + b)" },
            { type: "slider", key: "m", label: "Slope (m)", min: -10, max: 10, step: 0.1 },
            { type: "slider", key: "b", label: "Y-Intercept (b)", min: -30, max: 30, step: 1 },
            
            { type: "section", label: "Appearance" },
            { type: "slider", key: "lineWeight", label: "Thickness", min: 0.1, max: 0.5, step: 0.05 },
            { type: "color", key: "lineColor", label: "Line Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" },
        ];
    }

    draw() {
        push();
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawFunctionLine();
        
        pop();

        const sign = this.params.b >= 0 ? "+" : "-";
        this.drawHUD([
            `Equation: y = ${this.params.m.toFixed(1)}x ${sign} ${Math.abs(this.params.b).toFixed(1)}`,
            `Thickness: ${this.params.lineWeight} Units`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`   
        ]);
    }

    drawFunctionLine() {
        const { m, b, ppu, lineColor, lineWeight } = this.params;
        
        noFill();
        stroke(lineColor);
        strokeWeight(lineWeight * ppu);

        let x1 = (-width / 2) / ppu;
        let x2 = (width / 2) / ppu;
        
        let y1 = m * x1 + b;
        let y2 = m * x2 + b;

        line(x1 * ppu, y1 * ppu, x2 * ppu, y2 * ppu);
    }
}
registerVisual(new LinearFunctionGraph());

class QuadraticFunctionGraph extends Visual {
    constructor() {
        super({
            id: "quadratic-function-graph",
            name: "Quadratic Graph",
            category: "Beginner",
            description: "Explore Standard, Vertex, and Factored forms. Line thickness scales with zoom. Scroll to Zoom."
        });

        this.defaultParams = {
            ppu: 20, 
            form: "Standard",
            a: 1.0, b: 0.0, c: 0.0,
            h: 0.0, k: 0.0,
            r1: -2.0, r2: 2.0,
            lineColor: "#4caf50", 
            lineWeight: 0.15,
            showAxes: true, 
            showGrid: true
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
            { type: "slider", key: "a", label: "a (Curvature)", min: -10, max: 10, step: 0.1 }
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
            { type: "slider", key: "lineWeight", label: "Thickness (Units)", min: 0.01, max: 0.5, step: 0.01 },
            { type: "color", key: "lineColor", label: "Line Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
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
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        if (this.params.showAxes) this.drawStandardAxes();

        this.drawParabola();
        pop();

        this.drawFormulaHUD();
    }

    drawParabola() {
        const p = this.params;
        const ppu = p.ppu;
        
        noFill();
        stroke(p.lineColor);
        strokeWeight(p.lineWeight * ppu);

        beginShape();
        let step = 1; 
        for (let sx = -width / 2; sx <= width / 2; sx += step) {
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

    drawFormulaHUD() {
        const p = this.params;
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

        this.drawHUD([
            `Form: ${p.form}`,
            `Eq: ${eq}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }
}
registerVisual(new QuadraticFunctionGraph());

class TrigFunctionGraph extends Visual {
    constructor() {
        super({
            id: "trig-function-graph",
            name: "Trigonometric Graph",
            category: "Beginner",
            description: "Visualize Sine, Cosine, and Tangent waves."
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
            showGrid: true
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
            { type: "slider", key: "amplitude", label: "Amplitude (A)", min: 0, max: 15, step: 0.1 },
            { type: "slider", key: "frequency", label: "Frequency (B)", min: 0, max: 5, step: 0.1 },
            { type: "slider", key: "phaseShift", label: "Phase Shift (C)", min: -20, max: 20, step: 0.1 },
            { type: "slider", key: "verticalShift", label: "Vertical Shift (D)", min: -15, max: 15, step: 0.1 },
            { type: "section", label: "Appearance" },
            { type: "color", key: "lineColor", label: "Line Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    draw() {
        push();
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawTrigWave();
        pop();

        this.drawFormulaHUD();
    }

    drawTrigWave() {
        const p = this.params;
        const ppu = p.ppu;
        const canvasLimit = height / 2;

        noFill();
        stroke(p.lineColor);
        strokeWeight(p.lineWeight);

        let prevSY = null;

        beginShape();
        for (let sx = -width / 2; sx <= width / 2; sx += 1) {
            let x = sx / ppu;
            let angle = p.frequency * (x - p.phaseShift);
            
            let y = 0;
            if (p.funcType === "Sine") y = p.amplitude * Math.sin(angle) + p.verticalShift;
            else if (p.funcType === "Cosine") y = p.amplitude * Math.cos(angle) + p.verticalShift;
            else if (p.funcType === "Tangent") y = p.amplitude * Math.tan(angle) + p.verticalShift;

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

    drawFormulaHUD() {
        const p = this.params;
        const fName = p.funcType.toLowerCase();
        const a = this.fmt(p.amplitude);
        const b = this.fmt(p.frequency);
        const c = parseFloat(p.phaseShift);
        const d = parseFloat(p.verticalShift);

        const cStr = c >= 0 ? ` - ${this.fmt(c)}` : ` + ${this.fmt(Math.abs(c))}`;
        const dStr = d >= 0 ? ` + ${this.fmt(d)}` : ` - ${this.fmt(Math.abs(d))}`;

        let eq = `y = ${a} ${fName}(${b}(x${cStr}))${dStr}`;
        
        this.drawHUD([
            `Function: ${p.funcType}`,
            `Eq: ${eq}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }
}
registerVisual(new TrigFunctionGraph());

//Advanced Graphs

class ParametricCircle extends Visual {
    constructor() {
        super({
            id: "parametric-circle",
            name: "Parametric Circle",
            category: "Beginner",
            description: "Visualize a circle using the parametric equations: x = h + r cos(t), y = k + r sin(t)."
        });

        this.defaultParams = {
            ppu: 20,
            r: 5.0,
            h: 0.0,
            k: 0.0,
            t: 0,
            animate: false,
            animSpeed: 2,
            showComponents: true,
            circleColor: "#9c27b0",
            pointColor: "#ff5722",
            showGrid: true
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Geometry (Units)" },
            { type: "slider", key: "r", label: "Radius (r)", min: 0.5, max: 30, step: 0.1 },
            { type: "slider", key: "h", label: "Center X (h)", min: -15, max: 15, step: 0.1 },
            { type: "slider", key: "k", label: "Center Y (k)", min: -15, max: 15, step: 0.1 },

            { type: "section", label: "Parameter (t) [Space to Animate]" },
            { type: "slider", key: "t", label: "Angle θ (0-360°)", min: 0, max: 360, step: 1 },
            { type: "slider", key: "animSpeed", label: "Rotation Speed", min: 0.5, max: 3, step: 0.5 },

            { type: "section", label: "Visuals" },
            { type: "toggle", key: "showComponents", label: "Show X/Y Components" },
            { type: "toggle", key: "showLabels", label: "Show Labels" },
            { type: "toggle", key: "showGrid", label: "Show Grid" },
            
            { type: "section", label: "Appearance" },
            { type: "color", key: "circleColor", label: "Circle Color" },
            { type: "color", key: "pointColor", label: "Point Color" }
        ];
    }

    update() {
        if (this.params.animate) {
            let nextT = (this.params.t + this.params.animSpeed) % 360;
            this.setParam("t", nextT, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const ppu = p.ppu;
        const h_px = p.h * ppu;
        const k_px = p.k * ppu;
        const r_px = p.r * ppu;
        const radT = radians(p.t);

        const px = h_px + r_px * cos(radT);
        const py = k_px + r_px * sin(radT);

        this.drawCircle(h_px, k_px, r_px);
        this.drawComponents(h_px, k_px, px, py);
        this.drawPoint(px, py);

        pop();

        this.drawFormulaHUD(px, py);
    }

    drawCircle(h, k, r) {
        noFill();
        stroke(this.params.circleColor);
        strokeWeight(2);
        ellipse(h, k, r * 2);
    }

    drawComponents(h, k, px, py) {
        if (!this.params.showComponents) return;

        strokeWeight(1);
        drawingContext.setLineDash([5, 5]);

        stroke(150);
        line(h, k, px, py); 
        
        stroke(100);
        line(px, py, px, 0); 
        line(px, py, 0, py); 
        
        drawingContext.setLineDash([]);
    }

    drawPoint(px, py) {
        fill(this.params.pointColor);
        noStroke();
        circle(px, py, 10);
    }

    drawFormulaHUD(px, py) {
        const ux = px / this.params.ppu;
        const uy = py / this.params.ppu; 

        this.drawHUD([
            `x = ${this.params.h} + ${this.params.r} cos(${this.params.t.toFixed(0)}°) ≈ ${ux.toFixed(2)}`,
            `y = ${this.params.k} + ${this.params.r} sin(${this.params.t.toFixed(0)}°) ≈ ${uy.toFixed(2)}`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new ParametricCircle());

class EllipseVisual extends Visual {
    constructor() {
        super({
            id: "ellipse-circle",
            name: "Ellipse Visual",
            category: "Beginner",
            description: "Geometry of an ellipse: semi-axes, foci, and the constant sum property. Scroll to Zoom."
        });

        this.defaultParams = {
            ppu: 20,
            h: 0, k: 0,
            a: 8, b: 5,
            t: 45,
            animate: false,
            animSpeed: 2, 
            showFoci: true,
            showLinesToFoci: true,
            ellipseColor: "#3f51b5",
            fociColor: "#f44336",
            pointColor: "#ff9800",
            showGrid: true
        };

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Geometry (Units)" },
            { type: "slider", key: "h", label: "Center X (h)", min: -10, max: 10, step: 0.1 },
            { type: "slider", key: "k", label: "Center Y (k)", min: -10, max: 10, step: 0.1 },
            { type: "slider", key: "a", label: "Semi-Axis a (X)", min: 1, max: 36, step: 0.1 },
            { type: "slider", key: "b", label: "Semi-Axis b (Y)", min: 1, max: 30, step: 0.1 },
            
            { type: "section", label: "Point P & Animation [Space to Animate]" },
            { type: "slider", key: "t", label: "Point Angle (t)", min: 0, max: 360, step: 1 },
            { type: "toggle", key: "animate", label: "Animate Point" },
            { type: "slider", key: "animSpeed", label: "Rotation Speed", min: 0.5, max: 10, step: 0.5 },
            { type: "toggle", key: "showFoci", label: "Show Foci" },
            { type: "toggle", key: "showLinesToFoci", label: "Show String (d1+d2)" },

            { type: "section", label: "Appearance" },
            { type: "color", key: "ellipseColor", label: "Ellipse Color" },
            { type: "color", key: "fociColor", label: "Foci Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    update() {
        if (this.params.animate) {
            let nextT = (this.params.t + this.params.animSpeed) % 360;
            this.setParam("t", nextT, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const ppu = p.ppu;
        const h_px = p.h * ppu;
        const k_px = p.k * ppu;
        const a_px = p.a * ppu;
        const b_px = p.b * ppu;
        const radT = radians(p.t);

        const c = sqrt(abs(sq(p.a) - sq(p.b)));
        const px = h_px + a_px * cos(radT);
        const py = k_px + b_px * sin(radT);

        this.drawEllipseShape(h_px, k_px, a_px, b_px);
        this.drawFociAndString(h_px, k_px, a_px, b_px, c, px, py);
        this.drawPoint(px, py);

        pop();

        this.drawFormulaHUD(c);
    }

    drawEllipseShape(h, k, a, b) {
        noFill();
        stroke(this.params.ellipseColor);
        strokeWeight(3);
        ellipse(h, k, a * 2, b * 2);
    }

    drawFociAndString(h, k, a, b, c, px, py) {
        if (!this.params.showFoci) return;

        const ppu = this.params.ppu;
        const c_px = c * ppu;

        let f1x, f1y, f2x, f2y;
        if (a >= b) { 
            f1x = h - c_px; f1y = k;
            f2x = h + c_px; f2y = k;
        } else { 
            f1x = h; f1y = k - c_px;
            f2x = h; f2y = k + c_px;
        }

        if (this.params.showLinesToFoci) {
            strokeWeight(1.5);
            stroke(this.params.fociColor);
            drawingContext.setLineDash([5, 5]);
            line(f1x, f1y, px, py);
            line(f2x, f2y, px, py);
            drawingContext.setLineDash([]);
        }

        fill(this.params.fociColor);
        noStroke();
        circle(f1x, f1y, 8);
        circle(f2x, f2y, 8);
        
        push();
        scale(1, -1);
        textAlign(CENTER);
        text("F1", f1x, -f1y + 20);
        text("F2", f2x, -f2y + 20);
        pop();
    }

    drawPoint(px, py) {
        fill(this.params.pointColor);
        stroke(255);
        strokeWeight(2);
        circle(px, py, 12);
    }

    drawFormulaHUD(cUnits) {
        const p = this.params;
        let eq = `(x - ${p.h})² / ${sq(p.a).toFixed(1)} + (y - ${p.k})² / ${sq(p.b).toFixed(1)} = 1`;
        let sumText = "String: N/A";
        
        if (p.showLinesToFoci) {
            let sum = (p.a >= p.b) ? 2 * p.a : 2 * p.b;
            sumText = `Constant Sum (d1 + d2): ${sum.toFixed(2)}`;
        }

        this.drawHUD([
            `Eq: ${eq}`,
            `Eccentricity (c): ${cUnits.toFixed(2)}`,
            sumText,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new EllipseVisual());

class LissajousVisual extends Visual {
    constructor() {
        super({
            id: "lissajous-curves",
            name: "Lissajous Curves",
            category: "Beginner",
            description: "A curve produced by combining two perpendicular sine waves."
        });

        this.defaultParams = {
            ppu: 20,
            a: 3,
            b: 2,
            A: 10,
            B: 10,
            delta: 90,
            t: 0,
            animate: false,
            animSpeed: 1,
            curveColor: "#673ab7",
            showGrid: true,
        };

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Frequencies (a, b)" },
            { type: "slider", key: "a", label: "X Frequency (a)", min: 1, max: 10, step: 0.5 },
            { type: "slider", key: "b", label: "Y Frequency (b)", min: 1, max: 10, step: 0.5 },

            { type: "section", label: "Geometry & Phase" },
            { type: "slider", key: "A", label: "X Amplitude (A)", min: 1, max: 30, step: 0.5 },
            { type: "slider", key: "B", label: "Y Amplitude (B)", min: 1, max: 20, step: 0.5 },
            { type: "slider", key: "delta", label: "Phase Shift (δ)", min: 0, max: 360, step: 1 },

            { type: "section", label: "Animation [Space to Animate]" },
            { type: "toggle", key: "animate", label: "Auto-Animate" },
            { type: "slider", key: "animSpeed", label: "Speed", min: 0.5, max: 3, step: 0.25 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "curveColor", label: "Curve Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    update() {
        if (this.params.animate) {
            let nextDelta = (this.params.delta + this.params.animSpeed) % 360;
            this.setParam("delta", nextDelta, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const ppu = p.ppu;
        const radDelta = radians(p.delta);

        this.drawLissajousPath(p, ppu, radDelta);

        pop();

        this.drawFormulaHUD();
    }

    drawLissajousPath(p, ppu, radDelta) {
        noFill();
        stroke(p.curveColor);
        strokeWeight(2);
        
        beginShape();
        for (let t = 0; t <= TWO_PI * 10; t += 0.01) {
            let x = p.A * sin(p.a * t + radDelta);
            let y = p.B * sin(p.b * t);
            vertex(x * ppu, y * ppu);
        }
        endShape();
    }

    drawFormulaHUD() {
        const p = this.params;
        this.drawHUD([
            `x = ${p.A} sin(${p.a.toFixed(1)}t + ${p.delta.toFixed(0)}°)`,
            `y = ${p.B} sin(${p.b.toFixed(1)}t)`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ])
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new LissajousVisual());

class RoseVisual extends Visual {
    constructor() {
        super({
            id: "rose-curves",
            name: "Rose Curves",
            category: "Beginner",
            description: "A polar curve produced by r = a cos(kθ). Odd k = k petals, Even k = 2k petals."
        });

        this.defaultParams = {
            ppu: 20,
            a: 10,     
            k: 4,      
            offset: 0, 
            t: 0,      
            animate: false,
            animSpeed: 1,
            gridMode: "Polar",
            curveColor: "#e91e63",
        };

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Geometry (Polar)" },
            { type: "slider", key: "a", label: "Amplitude (Size)", min: 1, max: 30, step: 0.5 },
            { type: "slider", key: "k", label: "Petal Factor (k)", min: 1, max: 12, step: 1 },
            { type: "slider", key: "offset", label: "Offset (c)", min: 0, max: 3, step: 0.1 },

            { type: "section", label: "Animation [Space to Rotate]" },
            { type: "toggle", key: "animate", label: "Rotate Rose" },
            { type: "slider", key: "animSpeed", label: "Spin Speed", min: 0.5, max: 5, step: 0.5 },

            { type: "section", label: "Appearance" },
            { type: "select", key: "gridMode", label: "Grid Style", options: ["None", "Cartesian", "Polar", "Both"] },
            { type: "color", key: "curveColor", label: "Flower Color" }
        ];
    }

    update() {
        if (this.params.animate) {
            let nextT = (this.params.t + this.params.animSpeed) % 360;
            this.setParam("t", nextT); 
        }
    }

    draw() {
        push();
        this.setupCanvas(); 

        const mode = this.params.gridMode;
        if (mode === "Cartesian" || mode === "Both") this.drawStandardGrid(this.params.ppu);
        if (mode === "Polar" || mode === "Both") this.drawPolarGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const ppu = p.ppu;
        const rotationRad = radians(p.t);

        this.drawRosePath(p, ppu, rotationRad);

        pop();

        this.drawFormulaHUD();
    }

    drawRosePath(p, ppu, rotationRad) {
        noFill();
        stroke(p.curveColor);
        strokeWeight(2.5);
        
        beginShape();
        for (let theta = 0; theta <= TWO_PI; theta += 0.01) {
            let r = p.a * cos(p.k * theta) + p.offset;

            let x = r * cos(theta + rotationRad);
            let y = r * sin(theta + rotationRad);
            
            vertex(x * ppu, y * ppu);
        }
        endShape(CLOSE);
    }

    drawFormulaHUD() {
        const p = this.params;
        let petalCount = (p.k % 1 === 0) ? (p.k % 2 === 0 ? p.k * 2 : p.k) : "Complex";
        
        this.drawHUD([
            `Eq: r = ${p.a} cos(${p.k}θ) + ${p.offset}`,
            `Petals: ${petalCount}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new RoseVisual());

//Shapes

class RegularPolygonVisual extends Visual {
    constructor() {
        super({
            id: "regular-polygon",
            name: "Regular Polygon Visual",
            category: "Beginner",
            description: "Visualize the geometry of regular polygons: sides, angles, and symmetry."
        });

        this.defaultParams = {
            ppu: 20,
            sides: 5,
            radius: 10,
            rotation: 0,
            animate: false,
            animSpeed: 2,
            fillColor: "#3f51b5",   
            vertexColor: "#ff4081", 
            showVertices: true,
            showApothem: false,
            showGrid: true
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Geometry (Units)" },
            { type: "slider", key: "sides", label: "Number of Sides (n)", min: 3, max: 25, step: 1 },
            { type: "slider", key: "radius", label: "Radius (R)", min: 1, max: 40, step: 0.1 },
            
            { type: "section", label: "Animation [Space to Rotate]" },
            { type: "slider", key: "rotation", label: "Rotation", min: 0, max: 360, step: 1 },
            { type: "toggle", key: "animate", label: "Auto-Rotate" },
            { type: "slider", key: "animSpeed", label: "Rotation Speed", min: 0.5, max: 5, step: 0.5 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "fillColor", label: "Fill Color" },
            { type: "color", key: "vertexColor", label: "Vertex Color" },
            { type: "toggle", key: "showVertices", label: "Show Vertices" },
            { type: "toggle", key: "showApothem", label: "Show Apothem (a)" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    update() {
        if (this.params.animate) {
            let nextRot = (this.params.rotation + this.params.animSpeed) % 360;
            this.setParam("rotation", nextRot, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas(); 

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const R_px = p.radius * p.ppu;
        const rotRad = radians(p.rotation);

        let vertices = [];
        for (let i = 0; i < p.sides; i++) {
            let angle = TWO_PI * i / p.sides + rotRad;
            vertices.push({ x: cos(angle) * R_px, y: sin(angle) * R_px });
        }

        this.drawPolygonShape(vertices);

        if (p.showApothem) this.drawApothem(vertices);
        if (p.showVertices) this.drawVertices(vertices);
        pop();

        this.drawFormulaHUD();
    }

    drawPolygonShape(vertices) {
        let c = color(this.params.fillColor);
        let strokeCol = color(red(c)*0.7, green(c)*0.7, blue(c)*0.7);

        fill(this.params.fillColor);
        stroke(strokeCol);
        strokeWeight(3);
        beginShape();
        for (let v of vertices) vertex(v.x, v.y);
        endShape(CLOSE);
    }

    drawVertices(vertices) {
        fill(this.params.vertexColor);
        noStroke();
        for (let v of vertices) {
            circle(v.x, v.y, 10);
        }
    }

    drawApothem(vertices) {
        let midX = (vertices[0].x + vertices[1].x) / 2;
        let midY = (vertices[0].y + vertices[1].y) / 2;

        stroke(this.params.vertexColor);
        strokeWeight(2);
        drawingContext.setLineDash([5, 5]);
        line(0, 0, midX, midY);
        drawingContext.setLineDash([]);
        
        fill(this.params.vertexColor);
        circle(midX, midY, 6);
    }

    drawFormulaHUD() {
        const p = this.params;
        let sum = (p.sides - 2) * 180;
        let eachAngle = sum / p.sides;
        let apo = p.radius * cos(PI / p.sides);

        this.drawHUD([
            `Sides: ${p.sides}`,
            `Interior Sum: ${sum}°`,
            `Each Angle: ${eachAngle.toFixed(1)}°`,
            `Apothem: ${apo.toFixed(2)} Units`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new RegularPolygonVisual());

class StarPolygonVisual extends Visual {
    constructor() {
        super({
            id: "star-polygon",
            name: "Star Polygon Generator",
            category: "Beginner",
            description: "Create stars by alternating between an outer and inner radius. Visualize points, spikes, and symmetry."
        });

        this.defaultParams = {
            ppu: 20,
            points: 5,
            outerR: 12,
            innerR: 5,
            rotation: 0,
            animate: false,
            animSpeed: 2,
            fillColor: "#ff9800",
            vertexColor: "#f44336",
            showVertices: true,
            showGrid: true
        }

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Geometry (Units)" },
            { type: "slider", key: "points", label: "Number of Spikes (n)", min: 3, max: 30, step: 1 },
            { type: "slider", key: "outerR", label: "Outer Radius (R)", min: 1, max: 40, step: 0.1 },
            { type: "slider", key: "innerR", label: "Inner Radius (r)", min: 1, max: 40, step: 0.1 },
            
            { type: "section", label: "Animation [Space to Rotate]" },
            { type: "slider", key: "rotation", label: "Rotation", min: 0, max: 360, step: 1 },
            { type: "toggle", key: "animate", label: "Auto-Rotate" },
            { type: "slider", key: "animSpeed", label: "Rotation Speed", min: 0.5, max: 5, step: 0.5 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "fillColor", label: "Fill Color" },
            { type: "color", key: "vertexColor", label: "Vertex Color" },
            { type: "toggle", key: "showVertices", label: "Show Vertices" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    update() {
        if (this.params.animate) {
            let nextRot = (this.params.rotation + this.params.animSpeed) % 360;
            this.setParam("rotation", nextRot, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const ppu = p.ppu;
        const R_px = p.outerR * p.ppu;
        const r_px = p.innerR * p.ppu;
        const rotRad = radians(p.rotation);

        let vertices = [];
        let totalPoints = p.points * 2;
        for (let i = 0; i < totalPoints; i++) {
            let angle = TWO_PI * i / totalPoints + rotRad;
            let currentR = (i % 2 === 0) ? R_px : r_px;
            vertices.push({
                x: cos(angle) * currentR,
                y: sin(angle) * currentR
            });
        }

        this.drawStarShape(vertices);
        if (p.showVertices) this.drawVertices(vertices);

        pop();

        this.drawFormulaHUD();
    }

    drawStarShape(vertices) {
        let c = color(this.params.fillColor);
        let strokeCol = color(red(c)*0.6, green(c)*0.6, blue(c)*0.6);

        fill(this.params.fillColor);
        stroke(strokeCol);
        strokeWeight(3);
        beginShape();
        for (let v of vertices) vertex(v.x, v.y);
        endShape(CLOSE);
    }

    drawVertices(vertices) {
        fill(this.params.vertexColor);
        noStroke();
        for (let v of vertices) {
            circle(v.x, v.y, 8);
        }
    }

    drawFormulaHUD() {
        const p = this.params;
        let ratio = p.innerR / p.outerR;

        let lines = [
            `Spikes: ${p.points}`,
            `Radii: R=${p.outerR}, r=${p.innerR}`,
            `Ratio (r/R): ${ratio.toFixed(2)}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]

        this.drawHUD(lines);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new StarPolygonVisual());

//Distributions

class UniformRandomPoints extends Visual {
    constructor() {
        super({
            id: "random-points",
            name: "Uniform Random Points",
            category: "Beginner",
            description: "Visualize how points are distributed randomly within a boundary. Learn the difference between Square and Circular distributions."
        });

        this.points = [];
        this.defaultParams = {
            ppu: 20,
            pointCount: 1000,
            boundaryType: "Square",
            areaSize: 10,  
            pointSize: 0.4,   
            baseColor: "#00bcd4",
            showGrid: true,
            showBoundary: true
        }

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Distribution Logic" },
            { type: "slider", key: "pointCount", label: "Number of Points", min: 10, max: 2000, step: 10 },
            { type: "select", key: "boundaryType", label: "Boundary Shape", options: ["Square", "Circle"] },
            { type: "slider", key: "areaSize", label: "Area Size (Units)", min: 2, max: 40, step: 1 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "baseColor", label: "Point Theme" },
            { type: "slider", key: "pointSize", label: "Point Size (Units)", min: 0.05, max: 1.5, step: 0.05 },
            { type: "toggle", key: "showBoundary", label: "Show Boundary" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    init() {
        this.updatePalette(this.params.baseColor);
        this.generatePoints();
    }

    generatePoints() {
        this.points = [];
        const p = this.params;

        for (let i = 0; i < p.pointCount; i++) {
            let x, y;

            if (p.boundaryType === "Square") {
                x = random(-p.areaSize, p.areaSize);
                y = random(-p.areaSize, p.areaSize);
            } 
            else {
                let theta = random(TWO_PI);
                let r = sqrt(random(0, 1)) * p.areaSize;
                x = r * cos(theta);
                y = r * sin(theta);
            }

            this.points.push({
                x: x,
                y: y,
                color: random(this.palette.list)
            });
        }
    }

    onParamChange(key, value) {
        if (key === "baseColor") {
            this.updatePalette(value);
            this.points.forEach(pt => pt.color = random(this.palette.list));
        }
        if (key === "pointCount" || key === "boundaryType" || key === "areaSize") {
            this.generatePoints();
        }
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        if (this.params.showBoundary) this.drawBoundary();
        this.drawPoints();

        pop();

        this.drawFormulaHUD();
    }

    drawBoundary() {
        noFill();
        stroke(100, 100); 
        strokeWeight(2);
        const s = this.params.areaSize * this.params.ppu;

        if (this.params.boundaryType === "Square") {
            rectMode(CENTER);
            rect(0, 0, s * 2, s * 2);
        } else {
            circle(0, 0, s * 2);
        }
    }

    drawPoints() {
        const ppu = this.params.ppu;
        noStroke();
        for (let pt of this.points) {
            fill(pt.color);
            circle(pt.x * ppu, pt.y * ppu, this.params.pointSize * ppu);
        }
    }

    drawFormulaHUD() {
        const p = this.params;
        let area = (p.boundaryType === "Square") 
            ? Math.pow(p.areaSize * 2, 2) 
            : Math.PI * Math.pow(p.areaSize, 2);

        let density = p.pointCount / area;

        this.drawHUD([
            `Boundary: ${p.boundaryType}`,
            `Points: ${p.pointCount}`,
            `Density: ${density.toFixed(2)} pts/u²`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`,
            `Press SPACE to Reshuffle`
        ]);
    }

    keyPressed() {
        if (key === ' ') this.generatePoints();
    }
}
registerVisual(new UniformRandomPoints());

class NormalDistributionVisual extends Visual {
    constructor() {
        super({
            id: "normal-distribution",
            name: "Normal Distribution Sampling",
            category: "Beginner",
            description: "Visualize how points cluster around a central mean. See the 'Bell Curve' effect in 2D space."
        });

        this.points = [];
        this.defaultParams = {
            ppu: 20,
            pointCount: 500,
            meanX: 0,         
            meanY: 0,         
            stdDevX: 4.0,    
            stdDevY: 4.0,    
            pointSize: 0.3,
            baseColor: "#ff5722",
            showGrid: true,
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Distribution (Units)" },
            { type: "slider", key: "pointCount", label: "Number of Points", min: 50, max: 5000, step: 50 },
            { type: "slider", key: "stdDevX", label: "Spread X (σ)", min: 0.5, max: 15, step: 0.1 },
            { type: "slider", key: "stdDevY", label: "Spread Y (σ)", min: 0.5, max: 15, step: 0.1 },

            { type: "section", label: "Position (μ)" },
            { type: "slider", key: "meanX", label: "Mean X (μ)", min: -15, max: 15, step: 0.5 },
            { type: "slider", key: "meanY", label: "Mean Y (μ)", min: -15, max: 15, step: 0.5 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "baseColor", label: "Point Theme" },
            { type: "slider", key: "pointSize", label: "Point Size (Units)", min: 0.05, max: 1.0, step: 0.05 },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    init() {
        this.updatePalette(this.params.baseColor);
        this.generatePoints();
    }

    generatePoints() {
        this.points = [];
        const p = this.params;

        for (let i = 0; i < p.pointCount; i++) {
            let x = randomGaussian(p.meanX, p.stdDevX);
            let y = randomGaussian(p.meanY, p.stdDevY);

            this.points.push({
                x: x,
                y: y,
                color: random(this.palette.list)
            });
        }
    }

    onParamChange(key, value) {
        if (key === "baseColor") {
            this.updatePalette(value);
            this.points.forEach(pt => pt.color = random(this.palette.list));
        }
        if (["pointCount", "stdDevX", "stdDevY", "meanX", "meanY"].includes(key)) {
            this.generatePoints();
        }
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawDistribution();
        this.drawMeanMarker();

        pop();

        this.drawFormulaHUD();
    }

    drawDistribution() {
        const ppu = this.params.ppu;
        noStroke();
        for (let pt of this.points) {
            fill(pt.color);
            circle(pt.x * ppu, pt.y * ppu, this.params.pointSize * ppu);
        }
    }

    drawMeanMarker() {
        const ppu = this.params.ppu;
        stroke(0,150);
        strokeWeight(1.5);
        const mx = this.params.meanX * ppu;
        const my = this.params.meanY * ppu;
        let s = ppu * 0.5;
        line(mx - s, my, mx + s, my);
        line(mx, my - s, mx, my + s);
    }

    drawFormulaHUD() {
        const p = this.params;
        this.drawHUD([
            `Type: Gaussian Cluster`,
            `Mean (μ): (${p.meanX}, ${p.meanY})`,
            `Std Dev (σ): X:${p.stdDevX}, Y:${p.stdDevY}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`,
            `Press SPACE to Reshuffle`
        ]);
    }
}
registerVisual(new NormalDistributionVisual());

class MonteCarloPi extends Visual {
    constructor() {
        super({
            id: "monte-carlo-pi",
            name: "Monte Carlo Pi Estimation",
            category: "Beginner",
            description: "Estimate the value of Pi by scattering random points."
        });

        this.points = [];
        this.insideCount = 0;
        this.totalCount = 0;

        this.defaultParams = {
            ppu: 20,
            radius: 10,
            batchSize: 10,
            animate: false,
            baseColor: "#3f51b5",
            showGrid: true,
        }

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Simulation [Space to Play/Pause]" },
            { type: "toggle", key: "animate", label: "Run Simulation" },
            { type: "slider", key: "batchSize", label: "Points per Frame", min: 1, max: 100, step: 1 },
            
            { type: "section", label: "Geometry (Units)" },
            { type: "slider", key: "radius", label: "Circle Radius (r)", min: 5, max: 30, step: 0.5 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "baseColor", label: "Theme Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    init() {
        this.updatePalette(this.params.baseColor);
        this.resetSimulation();
    }

    resetSimulation() {
        this.points = [];
        this.insideCount = 0;
        this.totalCount = 0;
    }

    onParamChange(key, value) {
        if (key === "baseColor") this.updatePalette(value);
        if (key === "radius") this.resetSimulation();
    }

    update() {
        if (!this.params.animate) return;

        for (let i = 0; i < this.params.batchSize; i++) {
            this.addRandomPoint();
        }

        if (this.points.length > 5000) {
            this.points.shift();
        }
    }

    addRandomPoint() {
        const r = this.params.radius;
        let x = random(-r, r);
        let y = random(-r, r);

        let isInside = (x * x + y * y) <= (r * r);

        if (isInside) this.insideCount++;
        this.totalCount++;

        this.points.push({ x, y, isInside });
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawGeometry();
        this.drawPoints();

        pop();

        this.drawFormulaHUD();
    }

    drawGeometry() {
        const r_px = this.params.radius * this.params.ppu;

        noFill();
        stroke(100, 150);
        strokeWeight(2);
        rectMode(CENTER);
        rect(0, 0, r_px * 2, r_px * 2);

        stroke(this.palette.main);
        strokeWeight(2);
        circle(0, 0, r_px * 2);
    }

    drawPoints() {
        const ppu = this.params.ppu;
        noStroke();
        
        for (let p of this.points) {
            fill(p.isInside ? this.palette.main : this.palette.accent);
            circle(p.x * ppu, p.y * ppu, 5);
        }
    }

    drawFormulaHUD() {
        let piEstimate = (this.totalCount > 0)
            ? (4 * this.insideCount / this.totalCount) 
            : 0;
        
        let error = Math.abs(PI - piEstimate);

        this.drawHUD([
            `Total (N): ${this.totalCount}`,
            `Inside (M): ${this.insideCount}`,
            `π ≈ 4×(M/N) = ${piEstimate.toFixed(5)}`,
            `Error: ${error.toFixed(5)}`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`
        ]);
    }

     keyPressed() {
        if (key === ' ') this.setParam("animate", !this.params.animate, { controls: true });
    }
}
registerVisual(new MonteCarloPi());

//Simulations

class RandomWalkVisual extends Visual {
    constructor() {
        super({
            id: "random-walk",
            name: "Random Walk Algorithm",
            category: "Beginner",
            description: "A path defined by random steps. Perfectly aligned to the grid. Scroll to Zoom."
        });

        this.history = []; 
        this.defaultParams = {
            ppu: 20,
            stepSize: 1.0,     
            stepType: "4-Directional", 
            maxSteps: 500,     
            animate: true,
            animSpeed: 2,      
            baseColor: "#4caf50",
            showGrid: true
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Walk Logic" },
            { type: "select", key: "stepType", label: "Step Type", options: ["4-Directional", "Continuous"] },
            { type: "slider", key: "stepSize", label: "Step Length", min: 0.5, max: 2, step: 0.5 },
            { type: "slider", key: "maxSteps", label: "Trail Length", min: 50, max: 5000, step: 50 },

            { type: "section", label: "Animation [Space to Play/Pause]" },
            { type: "toggle", key: "animate", label: "Walking" },
            { type: "slider", key: "animSpeed", label: "Steps per Frame", min: 1, max: 20, step: 1 },

            { type: "section", label: "Appearance" },
            { type: "color", key: "baseColor", label: "Path Theme" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    init() {
        this.updatePalette(this.params.baseColor);
        this.resetWalk();
    }

    resetWalk() {
        this.history = [{ x: 0, y: 0, col: this.palette.main }];
    }

    onParamChange(key, value) {
        if (key === "baseColor") this.updatePalette(value);
        if (key === "stepType" || key === "stepSize") this.resetWalk();
        if (key === "maxSteps") this.pruneHistory();
    }

    pruneHistory() {
        while (this.history.length > this.params.maxSteps) {
            this.history.shift();
        }
    }

    update() {
        if (!this.params.animate) return;
        for (let i = 0; i < this.params.animSpeed; i++) {
            this.takeStep();
        }
        this.pruneHistory();
    }

    takeStep() {
        const last = this.history[this.history.length - 1];
        let nextX = last.x;
        let nextY = last.y;
        const s = this.params.stepSize;
        const ppu = this.params.ppu;

        if (this.params.stepType === "4-Directional") {
            let r = floor(random(4));
            if (r === 0) nextX += s;
            else if (r === 1) nextX -= s;
            else if (r === 2) nextY += s;
            else if (r === 3) nextY -= s;
        } 
        else {
            let angle = random(TWO_PI);
            nextX += cos(angle) * s;
            nextY += sin(angle) * s;
        }

        const limitX = (width / 2) / ppu;
        const limitY = (height / 2) / ppu;

        if (nextX > limitX || nextX < -limitX || nextY > limitY || nextY < -limitY) {
            return;
        }

        let segmentCol = random(this.palette.list);
        this.history.push({ x: nextX, y: nextY, col: segmentCol });
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawWalkPath();
        this.drawWalkerHead();

        pop();
        this.drawFormulaHUD();
    }

    drawWalkPath() {
        const ppu = this.params.ppu;
        noFill();
        strokeWeight(2);
        
        for (let i = 0; i < this.history.length - 1; i++) {
            let p1 = this.history[i];
            let p2 = this.history[i + 1];
            stroke(p2.col);
            line(p1.x * ppu, p1.y * ppu, p2.x * ppu, p2.y * ppu);
        }
    }

    drawWalkerHead() {
        const ppu = this.params.ppu;
        const last = this.history[this.history.length - 1];
        fill(this.palette.accent);
        noStroke();
        circle(last.x * ppu, last.y * ppu, ppu * 0.4);
    }

    drawFormulaHUD() {
        const last = this.history[this.history.length - 1];
        this.drawHUD([
            `Steps: ${this.history.length}`,
            `Mode: ${this.params.stepType}`,
            `X: ${last.x.toFixed(1)} | Y: ${last.y.toFixed(1)}`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new RandomWalkVisual());

class CirclePacking extends Visual {
    constructor() {
        super({
            id: "circle-packing",
            name: "Circle Packing",
            category: "Beginner",
            description: "A generative algorithm that grows circles until they touch. Scroll to Zoom."
        });

        this.circles = [];
        
        this.defaultParams = {
            ppu: 20,
            maxCircles: 750,
            growthSpeed: 0.1, 
            spawnRate: 10,
            animate: true,
            baseColor: "#e91e63"
        };

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Simulation [Space to Play/Pause]" },
            { type: "toggle", key: "animate", label: "Run Simulation" },
            { type: "slider", key: "maxCircles", label: "Max Circles", min: 100, max: 5000, step: 50 },
            { type: "slider", key: "growthSpeed", label: "Growth Speed (Units)", min: 0.01, max: 0.5, step: 0.01 },
            { type: "slider", key: "spawnRate", label: "Spawn Attempts", min: 1, max: 20, step: 1 },

            { type: "section", label: "Color Theme" },
            { type: "color", key: "baseColor", label: "Theme Color" }
        ];
    }

    init() {
        this.circles = [];
        this.updatePalette(this.params.baseColor); 
    }

    onParamChange(key, value) {
        if (key === "baseColor" || key === "maxCircles") this.init();
    }

    update() {
        if (!this.params.animate) return;

        const ppu = this.params.ppu;
        const limitX = (width / 2) / ppu;
        const limitY = (height / 2) / ppu;

        if (this.circles.length < this.params.maxCircles) {
            for (let i = 0; i < this.params.spawnRate; i++) {
                this.createNewCircle(limitX, limitY);
            }
        }

        this.circles.forEach(c => {
            if (c.growing) {
                if (Math.abs(c.x) + c.r > limitX || Math.abs(c.y) + c.r > limitY) {
                    c.growing = false;
                } else {
                    for (let other of this.circles) {
                        if (c !== other) {
                            let d = dist(c.x, c.y, other.x, other.y);
                            if (d < c.r + other.r + (2 / ppu)) { 
                                c.growing = false; 
                                break; 
                            }
                        }
                    }
                }
                if (c.growing) c.r += this.params.growthSpeed;
            }
        });
    }

    createNewCircle(lx, ly) {
        let rx = random(-lx, lx);
        let ry = random(-ly, ly);
        
        let valid = true;
        for (let c of this.circles) {
            if (dist(rx, ry, c.x, c.y) < c.r + (2 / this.params.ppu)) { 
                valid = false; 
                break; 
            }
        }

        if (valid) {
            this.circles.push({
                x: rx, y: ry, r: 0.1, growing: true,
                color: random(this.palette.list) 
            });
        }
    }

    draw() {
        push();
        this.setupCanvas();
        
        const ppu = this.params.ppu;

        this.circles.forEach(c => {
            fill(c.color);
            stroke(20, 150);
            strokeWeight(1); 
            circle(c.x * ppu, c.y * ppu, c.r * 2 * ppu);
        });
        
        pop();

        this.drawFormulaHUD();
    }

    drawFormulaHUD() {
        this.drawHUD([
            `Circles: ${this.circles.length} / ${this.params.maxCircles}`,
            `Growth: ${this.params.growthSpeed} u/f`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new CirclePacking());

//Bezier

class StandardBezier extends Visual {
    constructor() {
        super({
            id: "bezier-standard",
            name: "Standard Bezier",
            category: "Beginner",
            description: "Practical Bezier curves (Order 1-4). Drag points to reshape. Scroll to Zoom."
        });

        this.points = []; 
        this.layerColors = [];

        this.defaultParams = {
            ppu: 20,
            order: 3, 
            t: 0.5,
            animate: false,
            animSpeed: 0.01,
            showConstruction: true,
            curveColor: "#000000", 
            baseThemeColor: "#2196f3" 
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Complexity" },
            { type: "slider", key: "order", label: "Order (n)", min: 1, max: 4, step: 1 },

            { type: "section", label: "Animation & Progress [Space]" },
            { type: "slider", key: "t", label: "Progress (t)", min: 0, max: 1, step: 0.001 },
            { type: "toggle", key: "animate", label: "Auto-Animate" },

            { type: "section", label: "Appearance" },
            { type: "toggle", key: "showConstruction", label: "Show De Casteljau" },
            { type: "color", key: "baseThemeColor", label: "Construction Color" },
            { type: "color", key: "curveColor", label: "Curve Color" }
        ];
    }

    init() {
        this.syncPoints();
        this.generateLayerColors();
        this.updatePalette(this.params.baseThemeColor);
    }

    generateLayerColors() {
        this.layerColors = [];
        let base = color(this.params.baseThemeColor);
        push();
        colorMode(HSB, 360, 100, 100);
        let h = hue(base);
        for (let i = 0; i < 5; i++) {
            this.layerColors.push(color((h + i * 40) % 360, 80, 90));
        }
        pop();
    }

    syncPoints() {
        const targetCount = this.params.order + 1;
        while (this.points.length < targetCount) {
            let i = this.points.length;
            this.points.push(new MathPoint(random(-10, 10), random(-8, 8), `P${i}`));
        }
        this.points = this.points.slice(0, targetCount);
    }

    onParamChange(key, value) {
        if (key === "order") this.syncPoints();
        if (key === "baseThemeColor") this.generateLayerColors();
    }

    update() {
        const ppu = this.params.ppu;

        if (this.params.animate) {
            let nextT = this.params.t + this.params.animSpeed;
            if (nextT > 1) nextT = 0;
            nextT = Math.round(nextT * 10000) / 10000;
            this.setParam("t", nextT, { controls: true });
        }

        const limitX = (width / 2) / ppu;
        const limitY = (height / 2) / ppu;

        this.points.forEach(p => {
            p.update(ppu);
            p.x = constrain(p.x, -limitX, limitX);
            p.y = constrain(p.y, -limitY, limitY);
        });
    }

    draw() {
        push();
        this.setupCanvas();
        this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const ppu = this.params.ppu;

        stroke(200, 150); strokeWeight(1); drawingContext.setLineDash([5, 5]); noFill();
        beginShape();
        for (let p of this.points) vertex(p.x * ppu, p.y * ppu);
        endShape(); drawingContext.setLineDash([]);

        noFill(); stroke(this.params.curveColor); strokeWeight(4);
        beginShape();
        for (let i = 0; i <= 60; i++) {
            let pt = this.calculateBezier(this.points, i / 60);
            vertex(pt.x * ppu, pt.y * ppu);
        }
        endShape();

        if (this.params.showConstruction) {
            this.drawRecursive(this.points, this.params.t, ppu);
        }

        this.points.forEach(p => p.draw(ppu, this.palette.main));
        pop();

        this.drawHUD([
            `Order: ${this.params.order}`,
            `t: ${this.params.t.toFixed(3)}`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`
        ]);
    }

    calculateBezier(pts, t) {
        let temp = pts.map(p => ({x: p.x, y: p.y}));
        while (temp.length > 1) {
            let next = [];
            for (let i = 0; i < temp.length - 1; i++) {
                next.push({ x: lerp(temp[i].x, temp[i+1].x, t), y: lerp(temp[i].y, temp[i+1].y, t) });
            }
            temp = next;
        }
        return temp[0];
    }

    drawRecursive(pts, t, ppu, depth = 0) {
        if (pts.length < 2) return;
        let next = [];
        let col = this.layerColors[depth] || color(200);
        stroke(col); strokeWeight(2);
        for (let i = 0; i < pts.length - 1; i++) {
            let x = lerp(pts[i].x, pts[i+1].x, t);
            let y = lerp(pts[i].y, pts[i+1].y, t);
            next.push({x, y});
            line(pts[i].x * ppu, pts[i].y * ppu, pts[i+1].x * ppu, pts[i+1].y * ppu);
            fill(col); noStroke(); circle(x * ppu, y * ppu, 6); stroke(col);
        }
        if (next.length === 1) { fill(0); noStroke(); circle(next[0].x * ppu, next[0].y * ppu, 10); return; }
        this.drawRecursive(next, t, ppu, depth + 1);
    }

    mousePressed() {
        const ppu = this.params.ppu;
        const mx = mouseX - width / 2;
        const my = -(mouseY - height / 2);
        for (let i = this.points.length - 1; i >= 0; i--) {
            if (this.points[i].checkHit(mx, my, ppu)) {
                break; 
            }
        }
    }

    mouseReleased() {
        this.points.forEach(p => p.stopDragging());
    }

    keyPressed() {
        if (key === ' ') this.setParam("animate", !this.params.animate, { controls: true });
    }
}
registerVisual(new StandardBezier());

class HighOrderBezier extends Visual {
    constructor() {
        super({
            id: "bezier-high-order",
            name: "High Order Bezier",
            category: "Beginner",
            description: "Deep recursive geometry. Watch up to 16 layers of interpolation build complex shapes."
        });

        this.points = [];
        this.layerColors = [];

        this.defaultParams = {
            ppu: 20,
            order: 8, 
            t: 0.5,
            animate: false,
            animSpeed: 0.005,
            showConstruction: true,
            curveColor: "#000000",
            themeColor: "#ff0080"
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Complexity" },
            { type: "slider", key: "order", label: "Order (n)", min: 5, max: 16, step: 1 },

            { type: "section", label: "Animation & Progress [Space]" },
            { type: "slider", key: "t", label: "Progress (t)", min: 0, max: 1, step: 0.001 },
            { type: "toggle", key: "animate", label: "Auto-Animate" },

            { type: "section", label: "Appearance" },
            { type: "toggle", key: "showConstruction", label: "Show Construction" },
            { type: "color", key: "themeColor", label: "Spectrum Start Color" },
            { type: "color", key: "curveColor", label: "Final Curve Color" }
        ];
    }

    init() {
        this.syncPoints();
        this.generateLayerColors();
        this.updatePalette(this.params.themeColor);
    }

    generateLayerColors() {
        this.layerColors = [];
        let base = color(this.params.themeColor);
        push();
        colorMode(HSB, 360, 100, 100);
        let h = hue(base);
        for (let i = 0; i < 17; i++) {
            this.layerColors.push(color((h + i * (360 / 16)) % 360, 80, 90));
        }
        pop();
    }

    syncPoints() {
        const targetCount = this.params.order + 1;
        while (this.points.length < targetCount) {
            let i = this.points.length;
            let ang = i * 0.5;
            let d = 2 + i * 0.8;
            this.points.push(new MathPoint(cos(ang) * d, sin(ang) * d, `P${i}`));
        }
        this.points = this.points.slice(0, targetCount);
    }

    onParamChange(key, value) {
        if (key === "order") this.syncPoints();
        if (key === "themeColor") this.generateLayerColors();
    }

    update() {
        const ppu = this.params.ppu;

        if (this.params.animate) {
            let nextT = this.params.t + this.params.animSpeed;
            if (nextT > 1) nextT = 0;
            nextT = Math.round(nextT * 10000) / 10000;
            this.setParam("t", nextT, { controls: true });
        }

        const limitX = (width / 2) / ppu;
        const limitY = (height / 2) / ppu;

        this.points.forEach(p => {
            p.update(ppu);
            p.x = constrain(p.x, -limitX, limitX);
            p.y = constrain(p.y, -limitY, limitY);
        });
    }

    draw() {
        push();
        this.setupCanvas();
        this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const ppu = this.params.ppu;
        const t = this.params.t;

        noFill(); stroke(this.params.curveColor); strokeWeight(3);
        beginShape();
        let res = map(this.params.order, 5, 16, 80, 200);
        for (let i = 0; i <= res; i++) {
            let pt = this.calculateBezier(this.points, i / res);
            vertex(pt.x * ppu, pt.y * ppu);
        }
        endShape();

        if (this.params.showConstruction) {
            this.drawRecursive(this.points, t, ppu);
        }

        this.points.forEach(p => p.draw(ppu, "#444444"));

        pop();

        this.drawHUD([
            `Order: ${this.params.order}`,
            `t: ${this.params.t.toFixed(3)}`,
            `Zoom: ${this.params.ppu.toFixed(0)} px/unit`
        ]);
    }

    calculateBezier(pts, t) {
        let temp = pts.map(p => ({x: p.x, y: p.y}));
        while (temp.length > 1) {
            let next = [];
            for (let i = 0; i < temp.length - 1; i++) {
                next.push({ x: lerp(temp[i].x, temp[i+1].x, t), y: lerp(temp[i].y, temp[i+1].y, t) });
            }
            temp = next;
        }
        return temp[0];
    }

    drawRecursive(pts, t, ppu, depth = 0) {
        if (pts.length < 2) return;
        let next = [];
        let col = this.layerColors[depth] || color(200);
        
        stroke(col); 
        strokeWeight(map(depth, 0, 16, 1.8, 0.4));

        for (let i = 0; i < pts.length - 1; i++) {
            let x = lerp(pts[i].x, pts[i+1].x, t);
            let y = lerp(pts[i].y, pts[i+1].y, t);
            next.push({x, y});
            line(pts[i].x * ppu, pts[i].y * ppu, pts[i+1].x * ppu, pts[i+1].y * ppu);
        }

        if (next.length === 1) { 
            fill(0); noStroke(); 
            circle(next[0].x * ppu, next[0].y * ppu, 10); 
            return; 
        }

        this.drawRecursive(next, t, ppu, depth + 1);
    }

    mousePressed() {
        const ppu = this.params.ppu;
        const mx = mouseX - width / 2;
        const my = -(mouseY - height / 2);
        for (let i = this.points.length - 1; i >= 0; i--) {
            if (this.points[i].checkHit(mx, my, ppu)) {
                break; 
            }
        }
    }

    mouseReleased() {
        this.points.forEach(p => p.stopDragging());
    }

    keyPressed() {
        if (key === ' ') this.setParam("animate", !this.params.animate, { controls: true });
    }
}
registerVisual(new HighOrderBezier());
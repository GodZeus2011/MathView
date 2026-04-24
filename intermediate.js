class ArchimedeanSpiral extends Visual {
    constructor() {
        super({
            id: "archimedean-spiral",
            name: "Archimedean Spiral",
            category: "Intermediate",
            description: "A spiral where the distance from the origin grows linearly with the angle: r = a + bθ."
        });

        this.defaultParams = {
            ppu: 20,
            a: 0.0,
            b: 0.5,
            turns: 5.0,
            animateDraw: false,
            drawProgress: 1.0,
            gridMode: "Polar",
            curveColor: "#3f51b5",
            showGrid: true
        };

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Spiral Parameters (Units)" },
            { type: "slider", key: "a", label: "Initial Offset (a)", min: 0, max: 10, step: 0.1 },
            { type: "slider", key: "b", label: "Growth Rate (b)", min: 0.1, max: 2, step: 0.05 },
            { type: "slider", key: "turns", label: "Total Turns", min: 1, max: 20, step: 0.5 },

            { type: "section", label: "Animation" },
            { type: "toggle", key: "animateDraw", label: "Animate Drawing" },
            { type: "slider", key: "drawProgress", label: "Draw Progress", min: 0, max: 1, step: 0.01 },

            { type: "section", label: "Appearance" },
            { type: "select", key: "gridMode", label: "Grid Style", options: ["None", "Cartesian", "Polar", "Both"] },
            { type: "color", key: "curveColor", label: "Spiral Color" }
        ];
    }

    update() {
        if (this.params.animateDraw) {
            let nextProgress = Math.round((this.params.drawProgress + 0.002)*1000) / 1000;
            if (nextProgress > 1) nextProgress = 0;
            this.setParam("drawProgress", nextProgress, {controls: true});
        }
    }

    draw() {
        push();
        this.setupCanvas();

        const mode = this.params.gridMode;
        if (mode === "Cartesian" || mode === "Both") this.drawStandardGrid(this.params.ppu);
        if (mode === "Polar" || mode === "Both") this.drawPolarGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawSpiral();

        pop();

        this.drawSpiralHUD();
    }

    drawSpiral() {
        const p = this.params;
        const ppu = p.ppu;
        
        noFill();
        stroke(p.curveColor);
        strokeWeight(2.5);

        const totalTheta = p.turns * TWO_PI * p.drawProgress;
        
        beginShape();
        for (let theta = 0; theta <= totalTheta; theta += 0.05) {
            let r = p.a + p.b * theta;
            
            let x = r * cos(theta);
            let y = r * sin(theta);
            
            vertex(x * ppu, y * ppu);
        }
        endShape();

        if (totalTheta > 0) {
            let finalR = p.a + p.b * totalTheta;
            fill(p.curveColor);
            noStroke();
            circle(finalR * cos(totalTheta) * ppu, finalR * sin(totalTheta) * ppu, 8);
        }
    }

    drawSpiralHUD() {
        const p = this.params;
        const gap = 2 * Math.PI * p.b;

        this.drawHUD([
            `Eq: r = ${p.a.toFixed(1)} + ${p.b.toFixed(2)}θ`,
            `Rotations: ${p.turns.toFixed(1)}`,
            `Inter-arm Gap: ${gap.toFixed(2)} Units`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animateDraw", !this.params.animateDraw, {controls: true});
        }
    }
}
registerVisual(new ArchimedeanSpiral());

class LogarithmicSpiral extends Visual {
    constructor() {
        super({
            id: "logarithmic-spiral",
            name: "Logarithmic Spiral",
            category: "Intermediate",
            description: "An exponential spiral found in nature (shells, galaxies). It maintains a constant angle between its tangent and radial lines."
        });

        this.defaultParams = {
            ppu: 20,
            a: 0.5,          
            b: 0.15,           
            turns: 6.0,        
            animateDraw: false,
            drawProgress: 1.0, 
            showRadialLine: true,
            gridMode: "Polar",
            curveColor: "#009688",
            showGrid: true
        }

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Spiral Parameters" },
            { type: "slider", key: "a", label: "Initial Scale (a)", min: 0.1, max: 5, step: 0.1 },
            { type: "slider", key: "b", label: "Growth Rate (b)", min: 0.01, max: 0.1, step: 0.01, },
            { type: "slider", key: "turns", label: "Total Turns", min: 1, max: 10, step: 0.5 },

            { type: "section", label: "Animation & Properties" },
            { type: "toggle", key: "animateDraw", label: "Animate Drawing" },
            { type: "slider", key: "drawProgress", label: "Draw Progress", min: 0, max: 1, step: 0.01 },
            { type: "toggle", key: "showRadialLine", label: "Show Radial Line" },

            { type: "section", label: "Appearance" },
            { type: "select", key: "gridMode", label: "Grid Style", options: ["None", "Cartesian", "Polar", "Both"] },
            { type: "color", key: "curveColor", label: "Spiral Color" }
        ];
    }

    update() {
        if (this.params.animateDraw) {
            let nextProgress = Math.round((this.params.drawProgress + 0.002)*1000) / 1000;
            if (nextProgress > 1) nextProgress = 0;
            this.setParam("drawProgress", nextProgress, {controls: true});
        }
    }

    draw() {
        push();
        this.setupCanvas();
        
        const mode = this.params.gridMode;
        if (mode === "Cartesian" || mode === "Both") this.drawStandardGrid(this.params.ppu);
        if (mode === "Polar" || mode === "Both") this.drawPolarGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawSpiral();

        pop();

        this.drawSpiralHUD();
    }

    drawSpiral() {
        const p = this.params;
        const ppu = p.ppu;

        noFill();
        stroke(p.curveColor);
        strokeWeight(2.5);

        const totalTheta = p.turns * TWO_PI * p.drawProgress;

        beginShape();

        for (let theta = 0; theta <= totalTheta; theta += 0.05) {
            let r = p.a * Math.exp(p.b * theta);
            
            let x = r * cos(theta);
            let y = r * sin(theta);
            
            if (r * ppu < width * 2) {
                vertex(x * ppu, y * ppu);
            } else {
                break;
            }
        }
        endShape();

        if (totalTheta > 0) {
            let finalR = p.a * Math.exp(p.b * totalTheta);
            let px = finalR * cos(totalTheta) * ppu;
            let py = finalR * sin(totalTheta) * ppu;

            if (p.showRadialLine) {
                stroke(150, 150);
                strokeWeight(1);
                drawingContext.setLineDash([5, 5]);
                line(0, 0, px, py);
                drawingContext.setLineDash([]);
            }

            fill(p.curveColor);
            noStroke();
            circle(px, py, 8);
        }
    }

    drawSpiralHUD() {
        const p = this.params;
        const angleDeg = (Math.atan(1 / p.b) * 180 / Math.PI).toFixed(1);

        this.drawHUD([
            `Eq: r = ${p.a.toFixed(1)} · e^(${p.b.toFixed(2)}θ)`,
            `Growth per Turn: ${(Math.exp(p.b * TWO_PI)).toFixed(2)}x`,
            `Pitch Angle (ψ): ${angleDeg}°`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animateDraw", !this.params.animateDraw, { controls: true });
        }
    }
}
registerVisual(new LogarithmicSpiral());

class GoldenSpiral extends Visual {
    constructor() {
        super({
            id: "golden-spiral",
            name: "Golden Spiral & Fibonacci",
            category: "Intermediate",
            description: "A logarithmic spiral that grows by the Golden Ratio (phi) every 90 degrees. Visualized via Fibonacci squares."
        });

        this.phi = (1 + Math.sqrt(5)) / 2;
        this.fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

        this.defaultParams = {
            ppu: 15,
            iterations: 8,     
            showSquares: true,
            showSpiral: true,
            showLabels: true,
            animate: false,
            drawProgress: 1.0,
            baseColor: "#ff9800",
            gridMode: "Cartesian"
        };

        this.params = { ...this.defaultParams };

        this.paramDefs = [
            { type: "section", label: "Geometry" },
            { type: "slider", key: "iterations", label: "Iterations (Squares)", min: 1, max: 13, step: 1 },
            { type: "toggle", key: "showSquares", label: "Show Fibonacci Tiling" },
            { type: "toggle", key: "showSpiral", label: "Show Golden Spiral" },
            { type: "toggle", key: "showLabels", label: "Show Square Sizes" },

            { type: "section", label: "Animation" },
            { type: "toggle", key: "animate", label: "Animate Growth" },
            { type: "slider", key: "drawProgress", label: "Growth Progress", min: 0, max: 1, step: 0.01 },

            { type: "section", label: "Appearance" },
            { type: "select", key: "gridMode", label: "Grid Style", options: ["None", "Cartesian", "Polar"] },
            { type: "color", key: "baseColor", label: "Theme Color" }
        ];
    }

    init() {
        this.updatePalette(this.params.baseColor);
    }

    onParamChange(key, value) {
        if (key === "baseColor") this.updatePalette(value);
    }

    update() {
        if (this.params.animate) {
            let nextProgress = Math.round((this.params.drawProgress + 0.005)*1000)/1000;
            if (nextProgress > 1) nextProgress = 0;
            this.setParam("drawProgress", nextProgress, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.gridMode === "Cartesian") this.drawStandardGrid(this.params.ppu);
        if (this.params.gridMode === "Polar") this.drawPolarGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawFibonacciSystem();

        pop();

        this.drawGoldenHUD();
    }

    drawFibonacciSystem() {
        const p = this.params;
        const ppu = p.ppu;
        
        let x = 0;
        let y = 0;

        let dir = 0;

        for (let i = 0; i < p.iterations; i++) {
            let side = this.fibs[i] * ppu;
            let currentFib = this.fibs[i];

            let alpha = map(i, 0, p.iterations, 255, 50);
            if (i > p.iterations * p.drawProgress) break;

            if (p.showSquares) {
                fill(this.palette.list[i % this.palette.list.length]);
                stroke(30, 100);
                strokeWeight(1);
                
                if (dir === 0) rect(x, y, side, side);
                else if (dir === 1) rect(x, y, -side, side);
                else if (dir === 2) rect(x, y, -side, -side);
                else if (dir === 3) rect(x, y, side, -side);

                if (p.showLabels && this.fibs[i] > 2) {
                    this.drawSquareLabel(x, y, dir, side, this.fibs[i]);
                }
            }

            if (p.showSpiral) {
                noFill();
                stroke(30);
                strokeWeight(3);
                
                let cx, cy, startAng, endAng;

                if (dir === 0) { 
                    cx = x; cy = y + side; 
                    startAng = PI * 1.5; endAng = TWO_PI; 
                }
                else if (dir === 1) { 
                    cx = x - side; cy = y; 
                    startAng = 0; endAng = HALF_PI; 
                }
                else if (dir === 2) { 
                    cx = x; cy = y - side; 
                    startAng = HALF_PI; endAng = PI; 
                }
                else if (dir === 3) { 
                    cx = x + side; cy = y; 
                    startAng = PI; endAng = PI * 1.5; 
                }

                arc(cx, cy, side * 2, side * 2, startAng, endAng);
            }

            if (dir === 0) { x += side; y += side; }
            else if (dir === 1) { x -= side; y += side; }
            else if (dir === 2) { x -= side; y -= side; }
            else if (dir === 3) { x += side; y -= side; }

            dir = (dir + 1) % 4;
        }
    }

    drawSquareLabel(x, y, dir, side, val) {
        push();
        scale(1, -1);
        fill(0, 150);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(constrain(side * 0.2, 10, 20));

        let tx = x + (dir === 1 || dir === 2 ? -side / 2 : side / 2);
        let ty = -(y + (dir === 2 || dir === 3 ? -side / 2 : side / 2));
        
        text(val, tx, ty);
        pop();
    }

    drawGoldenHUD() {
        const p = this.params;
        const currentFib = this.fibs[p.iterations - 1];
        const nextFib = this.fibs[p.iterations];
        const approxPhi = nextFib / currentFib;

        this.drawHUD([
            `Golden Ratio (φ) ≈ 1.61803`,
            `Fibonacci Ratio: ${nextFib}/${currentFib} = ${approxPhi.toFixed(4)}`,
            `Iterations: ${p.iterations}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`,
            `Press SPACE to Animate`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
    }
}
registerVisual(new GoldenSpiral());

class FermatSpiral extends Visual {
    constructor() {
        super({
            id: "fermat-spiral",
            name: "Fermat Spiral",
            category: "Intermediate",
            description: "A parabolic spiral where r = ±a√θ. It features two symmetric arms that grow closer together as they expand."
        });

        this.defaultParams = {
            ppu: 20,
            a: 2.0,          
            turns: 10.0,      
            showSecondArm: true,
            animateDraw: false,
            drawProgress: 1.0,
            gridMode: "Polar",
            curveColor: "#ff5722",
            showGrid: true
        }

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Geometry (r = ±a√θ)" },
            { type: "slider", key: "a", label: "Scale Factor (a)", min: 0.5, max: 10, step: 0.1 },
            { type: "slider", key: "turns", label: "Total Turns", min: 1, max: 30, step: 0.5 },
            { type: "toggle", key: "showSecondArm", label: "Show Symmetric Arm (±)" },

            { type: "section", label: "Animation" },
            { type: "toggle", key: "animateDraw", label: "Animate Drawing" },
            { type: "slider", key: "drawProgress", label: "Draw Progress", min: 0, max: 1, step: 0.01 },

            { type: "section", label: "Appearance" },
            { type: "select", key: "gridMode", label: "Grid Style", options: ["None", "Cartesian", "Polar", "Both"] },
            { type: "color", key: "curveColor", label: "Spiral Color" }
        ];
    }

    update() {
        if (this.params.animateDraw) {
            let nextProgress = Math.round((this.params.drawProgress + 0.005)*1000)/1000;
            if (nextProgress > 1) nextProgress = 0;
            this.setParam("drawProgress", nextProgress, { controls: true });
        }
    }

    draw() {
        push();
        this.setupCanvas();

        const mode = this.params.gridMode;
        if (mode === "Cartesian" || mode === "Both") this.drawStandardGrid(this.params.ppu);
        if (mode === "Polar" || mode === "Both") this.drawPolarGrid(this.params.ppu);
        this.drawStandardAxes();

        this.drawFermatSpiral();

        pop();

        this.drawFermatHUD();
    }

    drawFermatSpiral() {
        const p = this.params;
        const ppu = p.ppu;
        
        noFill();
        stroke(p.curveColor);
        strokeWeight(2.5);

        const totalTheta = p.turns * TWO_PI * p.drawProgress;

        this.drawArm(1, totalTheta, ppu);

        if (p.showSecondArm) {
            let c = color(p.curveColor);
            noFill();
            stroke(red(c), green(c), blue(c), 180); 
            this.drawArm(-1, totalTheta, ppu);
        }
    }

    drawArm(dir, maxTheta, ppu) {
        const a = this.params.a;
        
        beginShape();
        for (let theta = 0; theta <= maxTheta; theta += 0.02) {
            let r = dir * a * Math.sqrt(theta);
            
            let x = r * cos(theta);
            let y = r * sin(theta);
            
            vertex(x * ppu, y * ppu);
        }
        endShape();

        if (maxTheta > 0) {
            let finalR = dir * a * Math.sqrt(maxTheta);
            fill(this.params.curveColor);
            noStroke();
            circle(finalR * cos(maxTheta) * ppu, finalR * sin(maxTheta) * ppu, 6);
        }
    }

    drawFermatHUD() {
        const p = this.params;
        this.drawHUD([
            `Equation: r² = ${Math.pow(p.a, 2).toFixed(1)}θ`,
            `Turns: ${p.turns.toFixed(1)}`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`,
            `Press SPACE to Animate`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animateDraw", !this.params.animateDraw, {controls: true});
        }
    }
}
registerVisual(new FermatSpiral());

class Spirograph extends Visual {
    constructor() {
        super({
            id: "spirograph",
            name: "Spirograph Generator",
            category: "Intermediate",
            description: "Visualize Hypotrochoids (Inside) and Epitrochoids (Outside) created by rolling one circle along another."
        });

        this.defaultParams = {
            ppu: 15,
            type: "Hypotrochoid", 
            R: 15,            
            r: 6,             
            d: 5,             
            rotations: 10,      
            t: 0,              
            animate: true,
            animSpeed: 0.05,
            showMachine: true, 
            curveColor: "#673ab7",
            showGrid: true
        }

        this.params = {...this.defaultParams};

        this.paramDefs = [
            { type: "section", label: "Mechanism Type" },
            { type: "select", key: "type", label: "Mode", options: ["Hypotrochoid", "Epitrochoid"] },
            
            { type: "section", label: "Gear Radii (Units)" },
            { type: "slider", key: "R", label: "Fixed Radius (R)", min: 5, max: 30, step: 0.5 },
            { type: "slider", key: "r", label: "Moving Radius (r)", min: 1, max: 20, step: 0.1 },
            { type: "slider", key: "d", label: "Pen Offset (d)", min: 0.5, max: 20, step: 0.1 },

            { type: "section", label: "Animation [Space]" },
            { type: "toggle", key: "animate", label: "Run Animation" },
            { type: "slider", key: "animSpeed", label: "Speed", min: 0.01, max: 0.2, step: 0.01 },
            { type: "slider", key: "rotations", label: "Path Length (Turns)", min: 1, max: 50, step: 1 },
            
            { type: "section", label: "Appearance" },
            { type: "toggle", key: "showMachine", label: "Show Gears" },
            { type: "color", key: "curveColor", label: "Pen Color" },
            { type: "toggle", key: "showGrid", label: "Show Grid" }
        ];
    }

    update() {
        if (this.params.animate) {
            let limit = this.params.rotations * TWO_PI * 10;
            let nextT = this.params.t + this.params.animSpeed;
            if (nextT > limit) nextT = 0;
            this.setParam("t", nextT);
        }
    }

    draw() {
        push();
        this.setupCanvas();

        if (this.params.showGrid) this.drawStandardGrid(this.params.ppu);
        this.drawStandardAxes();

        const p = this.params;
        const ppu = p.ppu;

        this.drawSpiroPath(p, ppu);

        if (p.showMachine) {
            this.drawMechanism(p, ppu);
        }

        pop();

        this.drawSpiroHUD();
    }

    getPos(t, p) {
        const { R, r, d, type } = p;
        let x, y;

        if (type === "Hypotrochoid") {
            x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
            y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
        } else {
            x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
            y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
        }
        return { x, y };
    }

    drawSpiroPath(p, ppu) {
        noFill();
        stroke(p.curveColor);
        strokeWeight(2);
        
        beginShape();
        for (let i = 0; i <= p.t; i += 0.05) {
            let pos = this.getPos(i, p);
            vertex(pos.x * ppu, pos.y * ppu);
        }
        let lastPos = this.getPos(p.t, p);
        vertex(lastPos.x * ppu, lastPos.y * ppu);
        endShape();
    }

    drawMechanism(p, ppu) {
        const { R, r, d, t, type } = p;

        stroke(200);
        strokeWeight(1);
        noFill();
        circle(0, 0, R * 2 * ppu);

        let centerDist = (type === "Hypotrochoid") ? (R - r) : (R + r);
        let mcX = centerDist * Math.cos(t);
        let mcY = centerDist * Math.sin(t);

        stroke(150, 150);
        circle(mcX * ppu, mcY * ppu, r * 2 * ppu);

        let penPos = this.getPos(t, p);
        stroke(100);
        line(mcX * ppu, mcY * ppu, penPos.x * ppu, penPos.y * ppu);

        fill(p.curveColor);
        noStroke();
        circle(penPos.x * ppu, penPos.y * ppu, 8);
    }

    drawSpiroHUD() {
        const p = this.params;
        const ratio = (p.R / p.r).toFixed(2);
        
        this.drawHUD([
            `Mode: ${p.type}`,
            `Ratio (R/r): ${ratio}`,
            `Offset (d): ${p.d.toFixed(1)} units`,
            `Zoom: ${p.ppu.toFixed(0)} px/unit`
        ]);
    }

    keyPressed() {
        if (key === ' ') {
            this.setParam("animate", !this.params.animate, { controls: true });
        }
        if (key === 'r' || key === 'R') {
            this.setParam("t", 0);
        }
    }
}
registerVisual(new Spirograph());
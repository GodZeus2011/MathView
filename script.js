const visuals = [];
let currentVisual = null;
const collapsedCategories = {};

//BASE VISUAL
class Visual {
    constructor({ id, name, category, description = "" }) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.defaultParams = {};
        this.params = {};
        this.paramDefs = [];
        this.palette = { list: [] };
    }

    init() {}
    update() {}
    draw() {}
    mousePressed() {}
    mouseDragged() {}
    mouseReleased() {}
    mouseWheel(event) {}
    keyPressed() {}
    keyReleased() {}

    getParamDefs() {
        return this.paramDefs;
    }

    onParamChange(key, value) {}

    setParam(key, value, {header = false, sidebar = false, controls = false} = {}) {
        this.params[key] = value;
        this.onParamChange(key, value);

        if (header || sidebar || controls) updateUI({header,sidebar,controls});
    }

    resetParams() {
        this.params = { ...this.defaultParams };
        Object.keys(this.defaultParams).forEach(key => {
            this.setParam(key, this.defaultParams[key]);
        });
        updateUI({controls: true});
        this.init();
    }

    triggerAction(action) {
        if (typeof this[action] === "function") {
            this[action]();
        }
    }



    setupCanvas() {
        translate(width / 2, height / 2);
        scale(1, -1);
    }

    updatePalette(hex) {
    if (!hex) return;
    let base = color(hex);
    
    push();
    colorMode(HSB, 360, 100, 100);
    let h = hue(base);
    let s = saturation(base);
    let b = brightness(base);

    this.palette = {
        main: base,
        accent: color((h + 180) % 360, s, b), 
        fill: color(h, s * 0.3, b, 0.5),      
        list: []                            
    };

    for (let i = 0; i < 9; i++) {
        let nh = (h + random(-20, 20) + 360) % 360; 
        let ns = constrain(s + random(-30, 30), 20, 100);
        let nb = constrain(b + random(-40, 40), 20, 100);
        this.palette.list.push(color(nh, ns, nb));
    }
    pop();
    }



    drawPolarGrid(ppu = 20, radialStep = 2, angleStep = 30, color = "#e0e0e0") {
        stroke(color);
        strokeWeight(0.5);
        noFill();

        for (let r = radialStep; r < 100; r += radialStep) {
            circle(0, 0, r * 2 * ppu);
        }

        for (let a = 0; a < 360; a += angleStep) {
            let rad = radians(a);
            let lx = cos(rad) * 1000;
            let ly = sin(rad) * 1000;
            line(0, 0, lx, ly);
        }
    }

    drawStandardGrid(ppu = 20, color = "#e0e0e0") {
        stroke(color);
        strokeWeight(0.5);
        let limitX = width / 2;
        let limitY = height / 2;
        for (let x = 0; x <= limitX; x += ppu) {
            line(x, -limitY, x, limitY);
            line(-x, -limitY, -x, limitY);
        }
        for (let y = 0; y <= limitY; y += ppu) {
            line(-limitX, y, limitX, y);
            line(-limitX, -y, limitX, -y);
        }
    }

    drawStandardAxes(color = "#333333") {
        stroke(color);
        strokeWeight(1.5);
        line(-width/2, 0, width/2, 0);
        line(0, -height/2, 0, height/2);
    }

    drawHUD(lines) {
        push();
        resetMatrix();
        fill(255, 230);
        noStroke();
        rect(10, 10, 240, lines.length * 22 + 40, 8);
        fill(30);
        textAlign(LEFT, TOP);
        textSize(14);
        textStyle(BOLD);
        text(this.name.toUpperCase(), 22, 22);
        textStyle(NORMAL);
        lines.forEach((line, i) => {
            text(line, 22, 50 + i * 22);
        });
        pop();
    }
}

class MathPoint {
    constructor(uX, uY, label = "") {
        this.x = uX; 
        this.y = uY;
        this.label = label;
        this.isDragging = false;
        this.size = 12;
    }

    update(ppu) {
        if (this.isDragging) {
            this.x = (mouseX - width / 2) / ppu;
            this.y = -(mouseY - height / 2) / ppu;
        }
    }

    draw(ppu, col) {
        fill(this.isDragging ? 255 : col);
        stroke(0);
        strokeWeight(2);
        circle(this.x * ppu, this.y * ppu, this.size);

        if (this.label) {
            push();
            scale(1, -1);
            fill(0); noStroke(); textAlign(CENTER); textSize(12);
            text(this.label, this.x * ppu, -this.y * ppu - 15);
            pop();
        }
    }

    checkHit(mx, my, ppu) {
        let d = dist(mx, my, this.x * ppu, this.y * ppu);
        this.isDragging = d < this.size;
        return this.isDragging;
    }

    stopDragging() { this.isDragging = false; }
}

//Register ids
function registerVisual(visualInstance) {
    if (visuals.some(v => v.id === visualInstance.id)) {
        console.error(`Duplicate visual id: ${visualInstance.id}`);
        return;
    }
    visuals.push(visualInstance);
}

//Header
function updateVisualHeader() {
    const titleEl = document.getElementById("visual-title");
    const descEl = document.getElementById("visual-description");

    if (!currentVisual) {
        titleEl.textContent = "No Visual Selected";
        descEl.textContent = "";
        return;
    }

    titleEl.textContent = currentVisual.name;
    descEl.textContent = currentVisual.description || "";
}

//Sidebar
function buildVisualSidebar() {
    const container = document.getElementById("visual-list");
    container.innerHTML = "";

    const grouped = {};

    visuals.forEach(visual => {
        if (!grouped[visual.category]) {
            grouped[visual.category] = [];
        }
        grouped[visual.category].push(visual);
    });

    Object.keys(grouped).forEach(category => {
        const groupDiv = document.createElement("div");
        groupDiv.className = "category-group";

        const header = document.createElement("button");
        header.className = "category-header";
        header.textContent = category;
        
        const content = document.createElement("div");
        content.className = "category-content";

        if (collapsedCategories[category]) {
            content.classList.add("collapsed");
        }
        
        header.addEventListener("click", () => {
            collapsedCategories[category] = !collapsedCategories[category];
            updateUI({sidebar: true});
        });

        grouped[category].forEach(visual => {
            const btn = document.createElement("button");
            btn.className = "visual-button";
            btn.textContent = visual.name;

            if (currentVisual && currentVisual.id === visual.id) {
                btn.classList.add("active");
            }

            btn.addEventListener("click", () => {
                switchVisual(visual.id);
            });

            content.appendChild(btn);
        });

        groupDiv.appendChild(header);
        groupDiv.appendChild(content);
        container.appendChild(groupDiv);
    });
}

//Controls
function buildControls() {
    const container = document.getElementById("controls-container");
    container.innerHTML = "";

    if (!currentVisual) return;

    const defs = currentVisual.getParamDefs();

    defs.forEach(def => {
        if(def.type === "section") {
            const section = document.createElement("div");
            section.className = "control-section";
            section.textContent = def.label;
            container.appendChild(section);
            return;
        }

        const group = document.createElement("div");
        group.className = "control-group";

        if (def.type !== "button") {
            const label = document.createElement("label");
            label.textContent = def.label;
            group.appendChild(label);
        }

        if (def.type === "slider") {
            const row = document.createElement("div");
            row.className = "control-row";

            const input = document.createElement("input");
            input.type = "range";
            input.min = def.min;
            input.max = def.max;
            input.step = def.step ?? 1;
            input.value = currentVisual.params[def.key];

            const value = document.createElement("span");
            value.className = "control-value";
            value.textContent = currentVisual.params[def.key];

            input.addEventListener("input", () => {
                const val = parseFloat(input.value);
                currentVisual.setParam(def.key, val);
                value.textContent = val;
            });

            row.appendChild(input);
            row.appendChild(value);
            group.appendChild(row);
        }

        else if (def.type === "number") {
            const input = document.createElement("input");
            input.type = "number";
            if (def.min !== undefined) input.min = def.min;
            if (def.max !== undefined) input.max = def.max;
            if (def.step !== undefined) input.step = def.step;
            input.value = currentVisual.params[def.key];

            input.addEventListener("input", () => {
                const val = parseFloat(input.value);
                if (!isNaN(val)) {
                    currentVisual.setParam(def.key, val);
                }
            });

            group.appendChild(input);
        }

        else if (def.type === "toggle") {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = !!currentVisual.params[def.key];

            input.addEventListener("change", () => {
                currentVisual.setParam(def.key, input.checked);
            });

            group.appendChild(input);
        }

        else if (def.type === "color") {
            const input = document.createElement("input");
            input.type = "color";
            input.value = currentVisual.params[def.key];

            input.addEventListener("input", () => {
                currentVisual.setParam(def.key, input.value);
            });

            group.appendChild(input);
        }

        else if (def.type === "select") {
            const select = document.createElement("select");

            def.options.forEach(option => {
                const opt = document.createElement("option");

                if (typeof option === "object") {
                    opt.value = option.value;
                    opt.textContent = option.label;
                }
                else {
                    opt.value = option;
                    opt.textContent = option;
                }

                select.appendChild(opt);
            });

            select.value = currentVisual.params[def.key];

            select.addEventListener("change", () => {
                currentVisual.setParam(def.key, select.value);
            });

            group.appendChild(select);
        }

        else if (def.type === "button") {
            const button = document.createElement("button");
            button.className = "control-button";
            button.textContent = def.label;

            button.addEventListener("click", () => {
                if (def.action) {
                    currentVisual.triggerAction(def.action);
                }
            });

            group.appendChild(button);
        }

        if (def.help) {
            const help = document.createElement("div");
            help.className = "help-text";
            help.textContent = def.help;
            group.appendChild(help);
        }

        container.appendChild(group);
    });
}

//UI refresh
function updateUI({header = false, sidebar = false, controls = false} = {}) {
    if (header) updateVisualHeader();
    if (sidebar) buildVisualSidebar();
    if (controls) buildControls();
}

function updateALL() {
    updateUI({ header: true, sidebar: true, controls: true });
}

//Switching
function switchVisual(id) {
    const found = visuals.find(v => v.id === id);
    if (!found) return;

    currentVisual = found;
    currentVisual.init();

    updateALL();
}

//P5JS
function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent("canvas-container");

    if (visuals.length > 0) {
        switchVisual(visuals[0].id);
    } 
    else {
        updateALL();
    }
}

function draw() {
    background(255);

    if(!currentVisual) return;

    if (currentVisual.params.ppu !== undefined) {
        let zoomSpeed = 1; 
        
        if (keyIsDown(UP_ARROW)) {
            let newPPU = constrain(currentVisual.params.ppu + zoomSpeed, 5, 100);
            currentVisual.setParam("ppu", newPPU, { controls: true });
        }
        if (keyIsDown(DOWN_ARROW)) {
            let newPPU = constrain(currentVisual.params.ppu - zoomSpeed, 5, 100);
            currentVisual.setParam("ppu", newPPU, { controls: true });
        }
    }

    currentVisual.update();
    currentVisual.draw();
}

//Event Forwarding
function mousePressed() {
    if (currentVisual) currentVisual.mousePressed();
}

function mouseDragged() {
    if (currentVisual) currentVisual.mouseDragged();
}

function mouseReleased() {
    if (currentVisual) currentVisual.mouseReleased();
}

function mouseWheel(event) {
    if (currentVisual) {
        return currentVisual.mouseWheel(event);
    }
}

function keyPressed() {
    if (!currentVisual) return;

    if (key === 'r' || key === 'R') {
        currentVisual.resetParams();
        return; 
    }

    if (key === 's' || key === 'S') {
        saveCanvas(currentVisual.id + "-snapshot", "png");
        return;
    }

    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        return false; 
    }

    currentVisual.keyPressed();
}

function keyReleased() {
    if (currentVisual) currentVisual.keyReleased();
}
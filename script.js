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

        for (let r = radialStep; r < 25; r += radialStep) {
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
        for (let x = -width/2; x <= width/2; x += ppu) line(x, -height/2, x, height/2);
        for (let y = -height/2; y <= height/2; y += ppu) line(-width/2, y, width/2, y);
    }

    drawStandardAxes(color = "#333333") {
        stroke(color);
        strokeWeight(1.5);
        line(-width/2, 0, width/2, 0);
        line(0, -height/2, 0, height/2);
    }
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

    currentVisual.keyPressed();
}

function keyReleased() {
    if (currentVisual) currentVisual.keyReleased();
}
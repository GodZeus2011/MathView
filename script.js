const visuals = [];
let currentVisual = null;

class Visual {
    constructor({ id, name, category}) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.params = {};
        this.paramDefs = [];
    }

    init() {}
    update() {}
    draw() {}
    mousePressed() {}
    mouseDragged() {}
    mouseReleased() {}

    getParamDefs() {
        return this.paramDefs;
    }
}

function registerVisual(visualInstance) {
    visuals.push(visualInstance);
}

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

        const title = document.createElement("div");
        title.className = "category-title";
        title.textContent = category;
        groupDiv.appendChild(title);
        
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

            groupDiv.appendChild(btn);
        });

        container.appendChild(groupDiv);
    });
}

function buildControls() {
    const container = document.getElementById("controls-container");
    container.innerHTML = "";

    if (!currentVisual) return;

    const defs = currentVisual.getParamDefs();

    defs.forEach(def => {
        const group = document.createElement("div");
        group.className = "control-group";

        const label = document.createElement("label");
        label.textContent = def.label;
        group.appendChild(label);

        container.appendChild(group);
    });
}

function switchVisual(id) {
    const found = visuals.find(v => v.id === id);
    if (!found) return;

    currentVisual = found;
    currentVisual.init();

    buildVisualSidebar();
    buildControls();
}

function setup() {
    const canvas = createCanvas(800, 600);
    canvas.parent("canvas-container");

    if (visuals.length > 0) {
        switchVisual(visuals[0].id);
    } 
    else {
        buildControls();
        buildVisualSidebar();
    }
}

function draw() {
    background(255);

    if(!currentVisual) return;

    currentVisual.update();
    currentVisual.draw();
}

function mousePressed() {
    if (currentVisual) currentVisual.mousePressed();
}

function mouseDragged() {
    if (currentVisual) currentVisual.mouseDragged();
}

function mouseReleased() {
    if (currentVisual) currentVisual.mouseReleased();
}
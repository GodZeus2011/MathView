class AdvancedPlaceholder extends Visual {
    constructor() {
        super({
            id: "advanced-placeholder",
            name: "Placeholder",
            category: "Advanced"
        });

        this.params = {};
        this.paramDefs = [];
    }

    init() {}
    update() {}

    draw() {
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Advanced Placeholder", width / 2, height / 2);
    }
}

registerVisual(new AdvancedPlaceholder());
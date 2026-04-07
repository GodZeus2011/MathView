class IntermediatePlaceholder extends Visual {
    constructor() {
        super({
            id: "intermediate-placeholder",
            name: "Placeholder",
            category: "Intermediate"
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
        text("Intermediate Placeholder", width / 2, height / 2);
    }
}

registerVisual(new IntermediatePlaceholder());
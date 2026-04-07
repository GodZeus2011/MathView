class BeginnerPlaceholder extends Visual {
    constructor() {
        super({
            id: "beginner-placeholder",
            name: "Placeholder",
            category: "Beginner"
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
        text("Beginner Placeholder", width / 2, height / 2);
    }
}

registerVisual(new BeginnerPlaceholder());
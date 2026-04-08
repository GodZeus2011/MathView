class BlankVisual extends Visual {
    constructor() {
        super({
            id: "blank-visual",
            name: "Blank-visual",
            category: "Beginner",
            description: "Starter template for building a new visualization."
        });

        this.defaultParams = {
            exampleValue: 50,
            showSomething: true,
            themeColor: "#3366ff",
            mode: "A"
        };
        this.params = { ...this.defaultParams };
        this.paramDefs = [
            {
                type: "section",
                label: "Example Controls"
            },
            {
                type: "slider",
                key: "exampleValue",
                label: "Example Value",
                min: 0,
                max: 100,
                step: 1,
                help: "Example numeric parameter."
            },
            {
                type: "toggle",
                key: "showSomething",
                label: "Show Something"
            },
            {
                type: "color",
                key: "themeColor",
                label: "Theme Color"
            },
            {
                type: "select",
                key: "mode",
                label: "Mode",
                options: ["A", "B", "C"]
            },
            {
                type: "button",
                label: "Reset",
                action: "resetParams"
            }
        ];
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
    onParamChange(key, value) {}
}
registerVisual(new BlankVisual());

class SimpleLineCircleDemo extends Visual {
    constructor() {
        super({
            id: "simple-line-circle-demo",
            name: "Simple Line / Circle Demo",
            category: "Beginner",
            description: "A basic beginner visual that switches between a centered circle and a centered line."
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
            {
                type: "section",
                label: "Shape"
            },
            {
                type: "select",
                key: "shape",
                label: "Shape Type",
                options: ["Circle", "Line"],
                help: "Choose whether to display a circle or a line."
            },
            {
                type: "section",
                label: "Geometry"
            },
            {
                type: "slider",
                key: "size",
                label: "Size",
                min: 20,
                max: 400,
                step: 1,
                help: "Controls the circle diameter or line length."
            },
            {
                type: "slider",
                key: "strokeWeight",
                label: "Stroke Weight",
                min: 1,
                max: 20,
                step: 1
            },
            {
                type: "section",
                label: "Appearance"
            },
            {
                type: "color",
                key: "strokeColor",
                label: "Stroke Color"
            },
            {
                type: "toggle",
                key: "fillEnabled",
                label: "Fill Enabled",
                help: "Only affects the circle."
            },
            {
                type: "color",
                key: "fillColor",
                label: "Fill Color"
            },
            {
                type: "section",
                label: "Actions"
            },
            {
                type: "button",
                label: "Reset",
                action: "resetParams"
            }
        ];
    }

    init() {}
    update() {}

    draw() {
        const cx = width / 2;
        const cy = height / 2;

        stroke(this.params.strokeColor);
        strokeWeight(this.params.strokeWeight);

        if (this.params.shape === "Circle") {
            if (this.params.fillEnabled) {
                fill(this.params.fillColor);
            } else {
                noFill();
            }

            circle(cx, cy, this.params.size);
        }

        else if (this.params.shape === "Line") {
            noFill();
            line(
                cx - this.params.size / 2,
                cy,
                cx + this.params.size / 2,
                cy
            );
        }
    }

    mousePressed() {}
    mouseDragged() {}
    mouseReleased() {}

    mouseWheel(event) {
        const newSize = constrain(this.params.size - event.delta * 0.1, 20, 400);
        this.setParam("size", newSize);
        buildControls();
        return false;
    }

    keyPressed() {
        if (key === "c" || key === "C") {
            this.setParam("shape", "Circle");
            buildControls();
        }

        if (key === "l" || key === "L") {
            this.setParam("shape", "Line");
            buildControls();
        }

        if (key === "r" || key === "R") {
            this.resetParams();
        }
    }

    keyReleased() {}

    onParamChange(key, value) {}
}
registerVisual(new SimpleLineCircleDemo());

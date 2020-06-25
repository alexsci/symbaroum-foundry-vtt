export class SymbaroumArtifactSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["symbaroum", "sheet", "item"],
            template: "systems/symbaroum/model/artifact.html",
            width: 600,
            height: 342,
            resizable: false
        });
    }

    /** @override */
    getData() {
        const data = super.getData();
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}

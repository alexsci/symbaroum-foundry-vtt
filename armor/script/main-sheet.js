export class SymbaroumArmorSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["symbaroum", "sheet", "item"],
            template: "systems/symbaroum/armor/model/main.html",
            width: 600,
            height: 341,
            resizable: false
        });
    }

    /** @override */
    getData() {
        const data = super.getData();
        console.log(data);
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
    }
}

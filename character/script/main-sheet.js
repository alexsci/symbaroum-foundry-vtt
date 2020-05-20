export class SymbaroumCharacterSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["symbaroum", "sheet", "actor"],
            template: "systems/symbaroum/character/model/main-sheet.html",
            width: 578,
            height: 757,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
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

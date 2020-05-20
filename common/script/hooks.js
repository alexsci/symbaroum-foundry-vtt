import {SymbaroumActor} from "./actor.js";
import {SymbaroumCharacterSheet} from "../../character/script/main-sheet.js";

Hooks.once("init", async function () {
    CONFIG.Combat.initiative = {formula: "@attributes.quick.value + @attributes.vigilant.value / 100", decimals: 2};
    CONFIG.Actor.entityClass = SymbaroumActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("symbaroum", SymbaroumCharacterSheet, {types: ["character"], makeDefault: true});
    preloadHandlebarsTemplates()
});

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/symbaroum/character/model/main-sheet.html"
    ];
    return loadTemplates(templatePaths);
}
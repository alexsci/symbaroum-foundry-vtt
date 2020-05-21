import {SymbaroumActor} from "./actor.js";
import {SymbaroumCharacterSheet} from "../../character/script/main-sheet.js";
import {SymbaroumAbilitySheet} from "../../ability/script/main-sheet.js";
import {SymbaroumWeaponSheet} from "../../weapon/script/main-sheet.js";
import {SymbaroumArmorSheet} from "../../armor/script/main-sheet.js";
import {SymbaroumGearSheet} from "../../gear/script/main-sheet.js";
import {SymbaroumArtifactSheet} from "../../artifact/script/main-sheet.js";

Hooks.once("init", async function () {
    CONFIG.Combat.initiative = {formula: "@attributes.quick.value + @attributes.vigilant.value / 100", decimals: 2};
    CONFIG.Actor.entityClass = SymbaroumActor;
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("symbaroum", SymbaroumCharacterSheet, {types: ["character"], makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("symbaroum", SymbaroumAbilitySheet, {types: ["ability"], makeDefault: true});
    Items.registerSheet("symbaroum", SymbaroumWeaponSheet, {types: ["weapon"], makeDefault: true});
    Items.registerSheet("symbaroum", SymbaroumArmorSheet, {types: ["armor"], makeDefault: true});
    Items.registerSheet("symbaroum", SymbaroumGearSheet, {types: ["gear"], makeDefault: true});
    Items.registerSheet("symbaroum", SymbaroumArtifactSheet, {types: ["artifact"], makeDefault: true});
    preloadHandlebarsTemplates()
});

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "systems/symbaroum/character/model/main.html",
        "systems/symbaroum/character/model/combat.html",
        "systems/symbaroum/character/model/gear.html",
        "systems/symbaroum/character/model/bio.html",
        "systems/symbaroum/ability/model/main.html",
        "systems/symbaroum/armor/model/main.html",
        "systems/symbaroum/weapon/model/main.html",
        "systems/symbaroum/gear/model/main.html",
        "systems/symbaroum/artifact/model/main.html",
    ];
    return loadTemplates(templatePaths);
}
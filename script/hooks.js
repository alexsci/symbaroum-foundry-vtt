import {SymbaroumActor} from "./actor/symbaroum.js";
import {SymbaroumCharacterSheet} from "./sheet/character.js";
import {SymbaroumAbilitySheet} from "./sheet/ability.js";
import {SymbaroumWeaponSheet} from "./sheet/wxeapon.js";
import {SymbaroumArmorSheet} from "./sheet/armor.js";
import {SymbaroumGearSheet} from "./sheet/gear.js";
import {SymbaroumArtifactSheet} from "./sheet/artifact.js";

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
        "systems/symbaroum/model/character/character.html",
        "systems/symbaroum/model/character/combat.html",
        "systems/symbaroum/model/character/gear.html",
        "systems/symbaroum/model/character/bio.html",
        "systems/symbaroum/model/ability.html",
        "systems/symbaroum/model/armor.html",
        "systems/symbaroum/model/artifact.html",
        "systems/symbaroum/model/gear.html",
        "systems/symbaroum/model/weapon.html",
    ];
    return loadTemplates(templatePaths);
}
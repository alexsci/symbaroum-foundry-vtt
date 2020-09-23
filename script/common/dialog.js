import { rollAttribute } from "./roll.js";

export async function prepareRollAttribute(attribute, armor, weapon) {
    const html = await renderTemplate("systems/symbaroum/template/chat/dialog.html", {});
    let dialog = new Dialog({
        title: attribute.name,
        content: html,
        buttons: {
            roll: {
                icon: '<i class="fas fa-check"></i>',
                label: "Roll",
                callback: async (html) => {
                    const modifierName = html.find("#modifier")[0].value;
                    const bonus = html.find("#bonus")[0].value;
                    const modifier = getTargetAttribute(modifierName, bonus);
                    await rollAttribute(attribute, modifier, armor, weapon);
                },
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: "Cancel",
                callback: () => {},
            },
        },
        default: "roll",
        close: () => {},
    });
    dialog.render(true);
}

function getTargetAttribute(attributeName, bonus) {
    const target = game.user.targets.values().next().value;
    if (target === undefined || attributeName === "custom") {
        return { name: game.i18n.localize("ATTRIBUTE.CUSTOM"), value: 10 - bonus };
    } else if (attributeName === "defense") {
        let defense = target.actor.data.data.combat.defense;
        return { name: game.i18n.localize("ARMOR.DEFENSE"), value: defense - bonus };
    } else {
        let attribute = target.actor.data.data.attributes[attributeName];
        return { name: game.i18n.localize(attribute.label), value: attribute.value - bonus };
    }
}
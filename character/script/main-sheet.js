export class SymbaroumCharacterSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["symbaroum", "sheet", "actor"],
            template: "systems/symbaroum/character/model/main.html",
            width: 907,
            height: 850,
            resizable: false,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "combat"}]
        });
    }

    /** @override */
    getData() {
        const data = super.getData();
        this.computeItems(data);
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-create').click(ev => {
            this.onItemCreate(ev)
        });
        html.find('.item-edit').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(div.data("itemId"));
            item.sheet.render(true);
        });
        html.find('.item-delete').click(ev => {
            const div = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(div.data("itemId"));
            div.slideUp(200, () => this.render(false));
        });
        html.find('.attribute b').click(ev => {
            const div = $(ev.currentTarget).parents(".attribute");
            const attributeName = div.data("key");
            const attribute = this.actor.data.data.attributes[attributeName];
            let d = new Dialog({
                title: "Roll for " +  game.i18n.localize(attribute.label),
                content: "<b>Defending Attribute</b><input style='width: 50px;margin-left: 5px;text-align: center' type='text' value=10 data-dtype='Number'/>",
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Roll",
                        callback: (html) => this.rollAttribute(attribute, html.children()[1].value)
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel",
                        callback: () => {}
                    }
                },
                default: "roll",
                close: () => {}
            });
            d.render(true);
        });
        html.find('.defense b').click(ev => {
            let d = new Dialog({
                title: "Roll for Defense",
                content: "<b>Attacking Attribute</b><input style='width: 50px;margin-left: 5px;text-align: center' type='text' value=10 data-dtype='Number'/>",
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Roll",
                        callback: (html) => this.rollDefense(this.actor.data.data.combat.armor.value, html.children()[1].value)
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel",
                        callback: () => {}
                    }
                },
                default: "roll",
                close: () => {}
            });
            d.render(true);
        });
        html.find('.protection b').click(ev => {
            this.rollArmor(this.actor.data.data.combat.armor);
        });
        html.find('.ability.item .clickable').click(ev => {
            const abilityId = $(ev.currentTarget).parents(".item").data("itemId");
            const ability = this.actor.getOwnedItem(abilityId);
            this.sendAbilityToChat(ability);
        });
        html.find('.weapon.item .clickable').click(ev => {
            const weaponId = $(ev.currentTarget).parents(".item").data("itemId");
            const weapon = this.actor.getOwnedItem(weaponId);
            this.rollDamage(weapon);
        });
        html.find('.weapon-gear.item .clickable').click(ev => {
            const weaponId = $(ev.currentTarget).parents(".item").data("itemId");
            const weapon = this.actor.getOwnedItem(weaponId);
            this.sendWeaponToChat(weapon);
        });
        html.find('.armor-item.item .clickable').click(ev => {
            const armorId = $(ev.currentTarget).parents(".item").data("itemId");
            const armor = this.actor.getOwnedItem(armorId);
            this.sendArmorToChat(armor);
        });
        html.find('.gear.item .clickable').click(ev => {
            const gearId = $(ev.currentTarget).parents(".item").data("itemId");
            const gear = this.actor.getOwnedItem(gearId);
            this.sendGearToChat(gear);
        });
        html.find('.artifact-item.item .clickable').click(ev => {
            const artifactId = $(ev.currentTarget).parents(".item").data("itemId");
            const artifact = this.actor.getOwnedItem(artifactId);
            this.sendArtifactToChat(artifact);
        });
    }

    computeItems(data) {
        for (let item of Object.values(data.items)) {
            item.isAbility = item.type === 'ability';
            item.isWeapon = item.type === 'weapon';
            item.isArmor = item.type === 'armor';
            item.isGear = item.type === 'gear';
            item.isArtifact = item.type === 'artifact';
        }
    }

    onItemCreate(event) {
        event.preventDefault();
        let header = event.currentTarget;
        let data = duplicate(header.dataset);
        data["name"] = `New ${data.type.capitalize()}`;
        this.actor.createEmbeddedEntity("OwnedItem", data);
    }

    rollAttribute(attribute, defenseAttribute) {
        let r = new Roll("1d20", {});
        r.roll();
        let result;
        let mod = (defenseAttribute - 10) * -1;
        let diceTarget = attribute.value + + mod;
        if (r._total <= diceTarget) {
            result = "<b style='color:green'>SUCCEED</b></br>"
        } else {
            result = "<b style='color:red'>FAILED</b></br>"
        }
        let attributeName = "<b>Attribute : </b>" + game.i18n.localize(attribute.label) + "</br>"
        let target = "<b>Target : </b>" + diceTarget + " (" + attribute.value + " + " + mod + ")</br>"
        let dice = "<b>Dice : </b>" + r._total
        let chatContent = result + attributeName + target + dice
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    rollDefense(defenseScore, attackingAttribute) {
        let r = new Roll("1d20", {});
        r.roll();
        let result;
        let mod = (attackingAttribute - 10) * -1;
        let diceTarget = defenseScore + + mod;
        if (r._total <= diceTarget) {
            result = "<b style='color:green'>SUCCEED</b></br>"
        } else {
            result = "<b style='color:red'>FAILED</b></br>"
        }
        let attributeName = "<b>Defense</b></br>"
        let target = "<b>Target : </b>" + diceTarget + " (" + defenseScore + " + " + mod + ")</br>"
        let dice = "<b>Dice : </b>" + r._total
        let chatContent = result + attributeName + target + dice
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    rollArmor(armor) {
        let r = new Roll(armor.protection, {});
        r.roll();
        let armorName = "<b>Armor : </b>" + armor.name + "</br>"
        let protection = "<b>Protection : </b>" + armor.protection + "</br>"
        let quality = "<b>Quality : </b>" + armor.quality + "</br>"
        let result = "<b>Result : </b>" + r._total
        let chatContent = armorName + protection + quality + result
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    rollDamage(weapon) {
        let r = new Roll(weapon.data.data.damage, {});
        r.roll();
        let weaponName = "<b>Weapon : </b>" + weapon.name + "</br>"
        let damage = "<b>Damage : </b>" + weapon.data.data.damage + "</br>"
        let quality = "<b>Quality : </b>" + weapon.data.data.quality + "</br>"
        let result = "<b>Result : </b>" + r._total
        let chatContent = weaponName + damage + quality + result
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    sendAbilityToChat(ability) {
        let name = "<b>Name : </b>" + ability.name + "</br>";
        let action = "<b>Action : </b>" + ability.data.data.action + "</br>";
        let level = "<b>Level : </b>" + ability.data.data.level + "</br>";
        let description = "<b>Description : </b>" + ability.data.data.description + "</br>";
        let chatContent = name + action + level + description
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    sendWeaponToChat(weapon) {
        let name = "<b>Name : </b>" + weapon.name + "</br>";
        let damage = "<b>Damage : </b>" + weapon.data.data.damage + "</br>";
        let quality = "<b>Quality : </b>" + weapon.data.data.quality + "</br>";
        let description = "<b>Description : </b>" + weapon.data.data.description + "</br>";
        let chatContent = name + damage + quality + description
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    sendArmorToChat(armor) {
        let name = "<b>Name : </b>" + armor.name + "</br>";
        let protection = "<b>Protection : </b>" + armor.data.data.protection + "</br>";
        let quality = "<b>Quality : </b>" + armor.data.data.quality + "</br>";
        let description = "<b>Description : </b>" + armor.data.data.description + "</br>";
        let chatContent = name + protection + quality + description
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    sendGearToChat(gear) {
        let name = "<b>Name : </b>" + gear.name + "</br>";
        let description = "<b>Description : </b>" + gear.data.data.description + "</br>";
        let chatContent = name + description
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }

    sendArtifactToChat(artifact) {
        let name = "<b>Name : </b>" + artifact.name + "</br>";
        let action = "<b>Action : </b>" + artifact.data.data.action + "</br>";
        let corruption = "<b>Corruption : </b>" + artifact.data.data.corruption + "</br>";
        let description = "<b>Description : </b>" + artifact.data.data.description + "</br>";
        let chatContent = name + action + corruption + description
        let chatData = {
            user: game.user._id,
            content: chatContent
        };
        ChatMessage.create(chatData, {});
    }
}

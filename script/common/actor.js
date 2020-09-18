export class SymbaroumActor extends Actor {
    prepareData() {
        super.prepareData();
        this._computeItems(this.data);
        this._computeSecondaryAttributes(this.data);
    }

    _computeItems(data) {
        for (let item of Object.values(data.items)) {
            item.isTrait = item.type === "trait";
            item.isAbility = item.type === "ability";
            item.isMysticalPower = item.type === "mysticalPower";
            item.isRitual = item.type === "ritual";
            item.isPower = item.isTrait || item.isAbility || item.isMysticalPower || item.isRitual;
            if (item.isPower) this._computePower(data, item);
            item.isWeapon = item.type === "weapon";
            item.isArmor = item.type === "armor";
            item.isEquipment = item.type === "equipment";
            item.isArtifact = item.type === "artifact";
            if (item.data.state) this._computeGear(data, item);
        }
    }

    _computeSecondaryAttributes(data) {
        data.data.health.toughness.max = data.data.attributes.strong.value > 10 ? data.data.attributes.strong.value : 10;
        data.data.health.toughness.threshold = Math.ceil(data.data.attributes.strong.value / 2);
        data.data.health.corruption.threshold = Math.ceil(data.data.attributes.resolute.value / 2);
        const activeArmor = this._getActiveArmor(data);
        data.data.combat = {
            id: activeArmor._id,
            armor: activeArmor.name,
            protection: activeArmor.data.protection,
            quality: activeArmor.data.quality,
            defense: data.data.attributes.quick.value - activeArmor.data.impeding
        };
    }

    _computePower(data, item) {
        if (item.isRitual) {
            item.data.actions = "Ritual"
        } else {
            let novice = "-";
            let adept = "-";
            let master = "-";
            if (item.data.novice.isActive) novice = item.data.novice.action;
            if (item.data.adept.isActive) adept = item.data.adept.action;
            if (item.data.master.isActive) master = item.data.master.action;
            item.data.actions = `${novice}/${adept}/${master}`;
        }
    }

    _computeGear(data, item) {
        item.isActive = item.data.state === "active";
        item.isEquipped = item.data.state === "equipped";
    }

    _getActiveArmor(data) {
        for (let item of Object.values(data.items)) {
            if (item.isArmor && item.isActive) {
                return item;
            }
        }
        return {
            id: null,
            name: "Armor",
            data: {
                protection: "0",
                quality: "",
                impeding: 0
            }
        };
    }
}
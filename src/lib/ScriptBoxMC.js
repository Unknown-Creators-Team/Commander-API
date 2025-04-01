import { Entity, Block, Player, EquipmentSlot, world, ItemStack, EnchantmentTypes, ItemLockMode } from '@minecraft/server';
import { uiManager, ActionFormData, MessageFormData, ModalFormData } from '@minecraft/server-ui';

Object.defineProperties(Entity.prototype, {
    isPlayer: {
        value: function () {
            return this instanceof Player;
        },
    },
    isEntity: {
        value: function () {
            return this instanceof Entity;
        },
    },
    isBlock: {
        value: function () {
            return this instanceof Block;
        },
    },
    container: {
        get: function () {
            const com = this.getComponent("minecraft:inventory");
            return com?.container;
        },
    },
    health: {
        set: function (v) {
            const com = this.getComponent("minecraft:health");
            com?.setCurrentValue(v);
        },
        get: function () {
            const com = this.getComponent("minecraft:health");
            return com?.currentValue;
        },
    },
});

Object.defineProperties(Player.prototype, {
    kick: {
        value: function (reason) {
            const result = this.runCommand(`kick ${JSON.stringify(this.name)} ${reason ?? ""}`);
            return result.successCount > 0;
        },
        configurable: true
    },
    closeAllForms: {
        value: function () {
            uiManager.closeAllForms(this);
        },
        configurable: true
    },
    isRiding: {
        get: function () {
            const com = this.getComponent("minecraft:riding");
            return com?.entityRidingOn !== undefined;
        },
        configurable: true
    },
    joinedAt: {
        get: function () {
            return this.getDynamicProperty("box@joinedAt");
        },
        configurable: true
    },
    equip: {
        get: function () {
            const com = this.getComponent("equippable");
            return {
                getHead: () => com?.getEquipment(EquipmentSlot.Head),
                getChest: () => com?.getEquipment(EquipmentSlot.Chest),
                getLegs: () => com?.getEquipment(EquipmentSlot.Legs),
                getFeet: () => com?.getEquipment(EquipmentSlot.Feet),
                getMainHand: () => com?.getEquipment(EquipmentSlot.Mainhand),
                getOffHand: () => com?.getEquipment(EquipmentSlot.Offhand),
            };
        },
        configurable: true
    },
});
world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        player.setDynamicProperty("box@joinedAt", Date.now());
    }
});
// Player.prototype.getComponent("equippable")?.getEquipment

Object.defineProperties(Block.prototype, {
    isPlayer: {
        value: function () {
            return this instanceof Player;
        },
    },
    isEntity: {
        value: function () {
            return this instanceof Entity;
        },
    },
    isBlock: {
        value: function () {
            return this instanceof Block;
        },
    },
});

Object.defineProperties(ItemStack.prototype, {
    enchantment: {
        get: function () {
            const com = this.getComponent("enchantable");
            const getEnchantmentType = (enchantmentType) => {
                if (typeof enchantmentType === "string") {
                    if (EnchantmentTypes.get(enchantmentType) === undefined)
                        throw new Error(`Invalid enchantment type: ${enchantmentType}`);
                    enchantmentType = EnchantmentTypes.get(enchantmentType);
                }
                return enchantmentType;
            };
            return {
                getEnchant: function (enchantmentType) {
                    return com?.getEnchantment(enchantmentType);
                },
                getAllEnchants: function () {
                    return com?.getEnchantments();
                },
                addEnchant: function (enchantmentType, level) {
                    com?.addEnchantment({ type: getEnchantmentType(enchantmentType), level });
                },
                canAddEnchant: function (enchantmentType, level) {
                    return com?.canAddEnchantment({ type: getEnchantmentType(enchantmentType), level });
                },
                removeEnchant: function (enchantmentType) {
                    com?.removeEnchantment(getEnchantmentType(enchantmentType));
                },
                removeAllEnchants: function () {
                    com?.removeAllEnchantments();
                },
                hasEnchant: function (enchantmentType) {
                    return com?.hasEnchantment(getEnchantmentType(enchantmentType));
                },
            };
        },
    },
});

class ActionFormBox {
    /** @private */ form;
    /** @private */ callbacks = [];
    // /** @private */ private cancelledCallback: ((cancelationReason?: FormCancelationReason) => void) | null = null; NULL だ！！ころせ！！
    /** @private */ backCallback;
    /** @private */ cancelledCallback;
    constructor(title) {
        this.form = new ActionFormData();
        if (title)
            this.form.title(title);
    }
    title(titleText) {
        this.form.title(titleText);
        return this;
    }
    body(bodyText) {
        this.form.body(bodyText);
        return this;
    }
    button(text, iconPath, callback) {
        this.form.button(text, iconPath);
        if (callback)
            this.callbacks.push(callback);
        return this;
    }
    back(callback) {
        this.backCallback = callback;
        return this;
    }
    cancel(callback) {
        this.cancelledCallback = callback;
        return this;
    }
    async show(player) {
        if (this.backCallback)
            this.form.button("Back", "textures/ui/arrowLeft.png");
        this.form.button("Close", "textures/ui/redX1.png");
        const response = await this.form.show(player);
        if (response.canceled) {
            if (this.cancelledCallback)
                this.cancelledCallback(response.cancelationReason);
            return response;
        }
        if (response.selection === undefined)
            throw new Error("Selection is undefined");
        if (response.selection === this.callbacks.length) {
            if (this.backCallback)
                this.backCallback(player);
            return response;
        }
        const callback = this.callbacks[response.selection];
        if (callback)
            callback();
        return response;
    }
}

class MessageFormBox {
    /** @private */ form = new MessageFormData();
    // /** @private */ private upperCallback: ((player: Player) => void) | null = null;
    // /** @private */ private lowerCallback: ((player: Player) => void) | null = null; // NULL だ！！ころせ！！ (undefined軍)
    // /** @private */ private cancelled: ((player: Player, cancelationReason?: FormCancelationReason) => void) | null = null;
    /** @private */ upperCallback;
    /** @private */ lowerCallback;
    /** @private */ cancelCallback;
    constructor(title) {
        if (title)
            this.form.title(title);
    }
    title(titleText) {
        this.form.title(titleText);
        return this;
    }
    body(bodyText) {
        this.form.body(bodyText);
        return this;
    }
    upperButton(text, callback) {
        this.form.button2(text);
        this.upperCallback = callback;
        return this;
    }
    lowerButton(text, callback) {
        this.form.button1(text);
        this.lowerCallback = callback;
        return this;
    }
    cancel(callback) {
        this.cancelCallback = callback;
        return this;
    }
    async show(player) {
        const response = await this.form.show(player);
        if (response.canceled) {
            if (this.cancelCallback)
                this.cancelCallback(player, response.cancelationReason);
            return response;
        }
        if (response.selection === 1) {
            if (this.upperCallback)
                this.upperCallback(player);
        }
        else if (response.selection === 0) {
            if (this.lowerCallback)
                this.lowerCallback(player);
        }
        return response;
    }
}

class ModalFormBox {
    /** @private */ form = new ModalFormData();
    /** @private */ bodyText;
    /** @private */ canSetBody = true;
    /** @private */ callbacks = [];
    /** @private */ cancelCallback;
    body(bodyText) {
        if (!this.canSetBody)
            throw new Error("Cannot set body after adding elements");
        this.bodyText = bodyText;
        return this;
    }
    cancel(callback) {
        this.cancelCallback = callback;
        return this;
    }
    divider() {
        this.form.divider();
        return this;
    }
    dropdown(label, options, defaultValueIndex, callback) {
        this.form.dropdown(this.formatLabel(label), options, defaultValueIndex);
        if (callback)
            this.callbacks.push(callback);
        return this;
    }
    header(headerText) {
        this.form.header(headerText);
        return this;
    }
    label(labelText) {
        this.form.label(labelText);
        return this;
    }
    async show(player) {
        const response = await this.form.show(player);
        if (response.canceled) {
            if (this.cancelCallback)
                this.cancelCallback(player, response.cancelationReason);
            return response;
        }
        for (const i in this.callbacks)
            if (response.formValues?.length)
                this.callbacks[i](player, response.formValues[i]);
        return response;
    }
    slider(label, minimumValue, maximumValue, valueStep, defaultValue, callback) {
        this.form.slider(this.formatLabel(label), minimumValue, maximumValue, valueStep, defaultValue);
        if (callback)
            this.callbacks.push(callback);
        return this;
    }
    submitButton(submitButtonText) {
        this.form.submitButton(submitButtonText);
        return this;
    }
    textField(label, placeholder, defaultValue, callback) {
        this.form.textField(this.formatLabel(label), placeholder ?? "", defaultValue);
        if (callback)
            this.callbacks.push(callback);
        return this;
    }
    title(titleText) {
        this.form.title(titleText);
        return this;
    }
    toggle(label, defaultValue, callback) {
        this.form.toggle(this.formatLabel(label), defaultValue);
        if (callback)
            this.callbacks.push(callback);
        return this;
    }
    /** @private */ formatLabel(label) {
        if (!this.canSetBody)
            return label;
        this.canSetBody = false;
        if (!this.bodyText)
            return label;
        if (typeof label === "string") {
            return `${this.bodyText}\n\n§r${label}`;
        }
        if (typeof label === "object") {
            label = { text: `${this.bodyText}\n\n§r`, ...label };
            return label;
        }
        throw new Error("Invalid label type");
    }
}

var ColorUtils;
(function (ColorUtils) {
    ColorUtils.ESCAPE = "§";
    ColorUtils.MATCH_REGEXP = new RegExp(ColorUtils.ESCAPE + "[0-9a-fk-or]", "g");
    function clean(text) {
        return text.replace(ColorUtils.MATCH_REGEXP, "");
    }
    ColorUtils.clean = clean;
    function includesColor(text) {
        return ColorUtils.MATCH_REGEXP.test(text);
    }
    ColorUtils.includesColor = includesColor;
})(ColorUtils || (ColorUtils = {}));

var ItemStackUtils;
(function (ItemStackUtils) {
    function toJSON(item) {
        const dynamicProperties = item.getDynamicPropertyIds().map((key) => {
            const value = item.getDynamicProperty(key);
            return [key, value];
        });
        const enchantments = item
            .getComponent("enchantable")
            ?.getEnchantments()
            .map((enchantment) => {
            return {
                level: enchantment.level,
                type: enchantment.type.id,
            };
        });
        return {
            typeId: item.typeId,
            amount: item.amount,
            keepOnDeath: item.keepOnDeath,
            lockMode: item.lockMode,
            nameTag: item.nameTag,
            dynamicProperties: Object.fromEntries(dynamicProperties),
            canDestroy: item.getCanDestroy(),
            canPlaceOn: item.getCanPlaceOn(),
            lore: item.getLore(),
            components: {
                durability: {
                    damage: item.getComponent("durability")?.damage,
                },
                dyeable: {
                    color: item.getComponent("dyeable")?.color,
                },
                enchantable: {
                    enchantments,
                },
            },
        };
    }
    ItemStackUtils.toJSON = toJSON;
    function fromJSON(json) {
        const item = new ItemStack(json.typeId, json.amount);
        item.keepOnDeath = json.keepOnDeath ?? false;
        item.lockMode = json.lockMode ?? ItemLockMode.none;
        item.nameTag = json.nameTag;
        for (const [key, value] of Object.entries(json.dynamicProperties ?? {})) {
            item.setDynamicProperty(key, value);
        }
        item.setCanDestroy(json.canDestroy ?? []);
        item.setCanPlaceOn(json.canPlaceOn ?? []);
        item.setLore(json.lore ?? []);
        if (json.components) {
            if (json.components.durability) {
                const com = item.getComponent("durability");
                if (com)
                    com.damage = json.components.durability.damage ?? 0;
            }
            if (json.components.dyeable) {
                const com = item.getComponent("dyeable");
                if (com)
                    com.color = json.components.dyeable.color ?? com.defaultColor;
            }
            if (json.components.enchantable) {
                const com = item.getComponent("enchantable");
                if (com) {
                    for (const enchantment of json.components.enchantable.enchantments ?? []) {
                        const enchantmentType = EnchantmentTypes.get(enchantment.type);
                        if (!enchantmentType)
                            throw new Error(`Invalid enchantment type: ${enchantment.type}`);
                        com.addEnchantment({ type: enchantmentType, level: enchantment.level });
                    }
                }
            }
        }
        return item;
    }
    ItemStackUtils.fromJSON = fromJSON;
    function minimizeJSON(json) {
        json.components = Object.fromEntries(Object.entries(json.components ?? {}).filter(([key, value]) => {
            if (key === "durability" && "damage" in value && (value.damage === 0 || value.damage === undefined))
                return false;
            if (key === "dyeable" && "color" in value && value.color === undefined)
                return false;
            if (key === "enchantable" && "enchantments" in value && value.enchantments?.length === 0)
                return false;
            return true;
        }));
        json = Object.fromEntries(Object.entries(json).filter(([key, value]) => {
            if (key === "keepOnDeath" && value === false)
                return false;
            if (key === "lockMode" && value === ItemLockMode.none)
                return false;
            if (key === "nameTag" && value === undefined)
                return false;
            if (key === "canDestroy" && value.length === 0)
                return false;
            if (key === "canPlaceOn" && value.length === 0)
                return false;
            if (key === "lore" && value.length === 0)
                return false;
            if (key === "dynamicProperties") {
                return Object.values(value).some((v) => v !== undefined && v !== null);
            }
            if (key === "components") {
                return Object.values(value).some((v) => v !== undefined && v !== null && Object.values(v).filter(Boolean).length > 0);
            }
            return value !== undefined && value !== null;
        }));
        return json;
    }
    ItemStackUtils.minimizeJSON = minimizeJSON;
})(ItemStackUtils || (ItemStackUtils = {}));

var ScoreboardUtils;
(function (ScoreboardUtils) {
    function addObjective(id, display) {
        return world.scoreboard.addObjective(id, display);
    }
    ScoreboardUtils.addObjective = addObjective;
    function getObjective(id) {
        const object = world.scoreboard.getObjective(id);
        if (!object)
            return addObjective(id);
        return object;
    }
    ScoreboardUtils.getObjective = getObjective;
    function deleteObjective(id) {
        return world.scoreboard.removeObjective(id);
    }
    ScoreboardUtils.deleteObjective = deleteObjective;
    function getScore(target, objective) {
        try {
            return getObjective(objective).getScore(target);
        }
        catch {
            return undefined;
        }
    }
    ScoreboardUtils.getScore = getScore;
    function addScore(target, objective, value) {
        return getObjective(objective).addScore(target, value);
    }
    ScoreboardUtils.addScore = addScore;
    function setScore(target, objective, value) {
        return getObjective(objective).setScore(target, value);
    }
    ScoreboardUtils.setScore = setScore;
    function resetScore(target, objective) {
        return getObjective(objective).removeParticipant(target);
    }
    ScoreboardUtils.resetScore = resetScore;
})(ScoreboardUtils || (ScoreboardUtils = {}));

export { ActionFormBox, ColorUtils, ItemStackUtils, MessageFormBox, ModalFormBox, ScoreboardUtils };

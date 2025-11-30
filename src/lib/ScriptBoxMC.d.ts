// File: /@types/base.d.ts
import * as Minecraft from "@minecraft/server";
import * as MinecraftUI from "@minecraft/server-ui";

declare module "@minecraft/server" {
    interface Player {
        // methods
        readonly kick(reason?: string): boolean;

        // properties
        // /** @deprecated */
        readonly isRiding: boolean;
        readonly joinedAt: number | undefined;
        readonly equip: {
            getHead(): Minecraft.ItemStack | undefined;
            getChest(): Minecraft.ItemStack | undefined;
            getLegs(): Minecraft.ItemStack | undefined;
            getFeet(): Minecraft.ItemStack | undefined;
            getMainHand(): Minecraft.ItemStack | undefined;
            getOffHand(): Minecraft.ItemStack | undefined;
        };
    }

    interface Entity {
        isPlayer(): this is Player;
        isEntity(): this is Entity;
        isBlock(): this is Block;

        // properties
        health: number | undefined;
        readonly container: Minecraft.Container | undefined;
    }

    interface Block {
        isPlayer(): this is Player;
        isEntity(): this is Entity;
        isBlock(): this is Block;
    }

    interface ItemStack {
        enchantment: {
            getEnchant(enchantment: EnchantmentType | string): Enchantment | undefined;
            getAllEnchants(): Enchantment[];
            addEnchant(enchantment: EnchantmentType | string, level: number): void;
            canAddEnchant(enchantment: EnchantmentType | string, level: number): boolean;
            removeEnchant(enchantment: EnchantmentType | string): void;
            removeAllEnchants(): void;
            hasEnchant(enchantment: EnchantmentType | string): boolean;
        };
        // toJSON(): string;
        // static fromJSON(json: string): ItemStack;
        // static fromJSON(json: string): ItemStack;
    }
}

// File: /scripts/form/action.d.ts
import { Player, RawMessage } from "@minecraft/server";
import { ActionFormResponse, FormCancelationReason } from "@minecraft/server-ui";
export declare class ActionFormBox {
    /** @private */ private form;
    /** @private */ private callbacks;
    /** @private */ private backCallback;
    /** @private */ private cancelledCallback;
    constructor(title?: string);
    title(titleText: RawMessage | string): ActionFormBox;
    body(bodyText: RawMessage | string): ActionFormBox;
    button(text: RawMessage | string, iconPath?: string, callback?: () => void): ActionFormBox;
    back(callback: (player: Player) => void): ActionFormBox;
    cancel(callback: (cancelationReason?: FormCancelationReason) => void): ActionFormBox;
    label(text: RawMessage | string): ActionFormBox;
    divider(): ActionFormBox;
    show(player: Player): Promise<ActionFormResponse>;
}


// File: /scripts/form/message.d.ts
import { Player, RawMessage } from "@minecraft/server";
import { FormCancelationReason, MessageFormResponse } from "@minecraft/server-ui";
export declare class MessageFormBox {
    /** @private */ private form;
    /** @private */ private upperCallback;
    /** @private */ private lowerCallback;
    /** @private */ private cancelCallback;
    constructor(title?: RawMessage | string);
    title(titleText: RawMessage | string): MessageFormBox;
    body(bodyText: RawMessage | string): MessageFormBox;
    upperButton(text: RawMessage | string, callback: (player: Player) => void): MessageFormBox;
    lowerButton(text: RawMessage | string, callback: (player: Player) => void): MessageFormBox;
    cancel(callback: (player: Player, cancelationReason?: FormCancelationReason) => void): MessageFormBox;
    show(player: Player): Promise<MessageFormResponse>;
}


// File: /scripts/form/modal.d.ts
import { Player, RawMessage } from "@minecraft/server";
import { FormCancelationReason, ModalFormResponse } from "@minecraft/server-ui";
interface DropdownOptions {
    label: RawMessage | string;
    options: (RawMessage | string)[];
    defaultValueIndex?: number;
    tooltip?: RawMessage | string;
    callback?: ModalElementCallback;
}
interface SliderOptions {
    label: RawMessage | string;
    minimumValue: number;
    maximumValue: number;
    valueStep: number;
    defaultValue?: number;
    tooltip?: RawMessage | string;
    callback?: ModalElementCallback;
}
interface TextFieldOptions {
    label: RawMessage | string;
    placeholder?: RawMessage | string;
    defaultValue?: string;
    tooltip?: RawMessage | string;
    callback?: ModalElementCallback;
}
interface ToggleOptions {
    label: RawMessage | string;
    defaultValue?: boolean;
    tooltip?: RawMessage | string;
    callback?: ModalElementCallback;
}
type ModalElementCallback = (player: Player, response: any, responses: (string | number | boolean | undefined)[]) => void;
export declare class ModalFormBox {
    /** @private */ private form;
    /** @private */ private bodyText;
    /** @private */ private canSetBody;
    /** @private */ private callbacks;
    /** @private */ private cancelCallback;
    body(bodyText: string): ModalFormBox;
    cancel(callback: (player: Player, reason?: FormCancelationReason) => void): ModalFormBox;
    divider(): ModalFormBox;
    dropdown({ label, options, defaultValueIndex, tooltip, callback }: DropdownOptions): ModalFormBox;
    header(headerText: RawMessage | string): ModalFormBox;
    label(labelText: RawMessage | string): ModalFormBox;
    show(player: Player): Promise<ModalFormResponse>;
    slider({ label, minimumValue, maximumValue, valueStep, defaultValue, tooltip, callback }: SliderOptions): ModalFormBox;
    submitButton(submitButtonText: RawMessage | string): ModalFormBox;
    textField({ label, placeholder, defaultValue, tooltip, callback }: TextFieldOptions): ModalFormBox;
    title(titleText: RawMessage | string): ModalFormBox;
    toggle({ label, defaultValue, tooltip, callback }: ToggleOptions): ModalFormBox;
    /** @private */ private formatLabel;
}
export {};


// File: /scripts/utils/color.d.ts
export declare namespace ColorUtils {
    const ESCAPE = "\u00A7";
    const MATCH_REGEXP: RegExp;
    const INVALID_MATCH_REGEXP: RegExp;
    function clean(text: string): string;
    function includesColor(text: string): boolean;
    function includesInvalidColor(text: string): boolean;
    enum ColorCode {
        BLACK = "0",
        DARK_BLUE = "1",
        DARK_GREEN = "2",
        DARK_AQUA = "3",
        DARK_RED = "4",
        DARK_PURPLE = "5",
        GOLD = "6",
        GRAY = "7",
        DARK_GRAY = "8",
        BLUE = "9",
        GREEN = "a",
        AQUA = "b",
        RED = "c",
        LIGHT_PURPLE = "d",
        YELLOW = "e",
        WHITE = "f",
        MINECOIN_GOLD = "g",
        MATERIAL_QUARTZ = "h",
        MATERIAL_IRON = "i",
        MATERIAL_NETHERITE = "j",
        MATERIAL_REDSTONE = "m",
        MATERIAL_COPPER = "n",
        MATERIAL_GOLD = "p",
        MATERIAL_EMERALD = "q",
        MATERIAL_DIAMOND = "s",
        MATERIAL_LAPIS = "t",
        MATERIAL_AMETHYST = "u",
        MATERIAL_RESIN = "v",
        OBFUSCATED = "k",
        BOLD = "l",
        ITALIC = "o",
        RESET = "r"
    }
}


// File: /scripts/utils/item.d.ts
import { ItemLockMode, ItemStack, RGB, Vector3 } from "@minecraft/server";
export declare namespace ItemStackUtils {
    export function toJSON(item: ItemStack): ItemStackJSON;
    export function fromJSON(json: ItemStackJSON): ItemStack;
    export function minimizeJSON(json: ItemStackJSON): ItemStackJSON;
    interface ItemStackJSON {
        typeId: string;
        amount: number;
        keepOnDeath?: boolean;
        lockMode?: keyof typeof ItemLockMode;
        nameTag?: string;
        dynamicProperties?: Record<string, boolean | number | string | Vector3 | undefined>;
        canDestroy?: string[];
        canPlaceOn?: string[];
        lore?: string[];
        components?: {
            durability?: {
                damage?: number;
            };
            dyeable?: {
                color?: RGB;
            };
            enchantable?: {
                enchantments?: {
                    level: number;
                    type: string;
                }[];
            };
        };
    }
    export {};
}


// File: /scripts/utils/scoreboard.d.ts
import { Entity, ScoreboardIdentity, ScoreboardObjective } from "@minecraft/server";
export declare namespace ScoreboardUtils {
    function addObjective(id: string, display?: string): ScoreboardObjective;
    function getObjective(id: string): ScoreboardObjective;
    function deleteObjective(id: string): boolean;
    function getScore(target: ScoreboardIdentity | Entity | string, objective: string): number | undefined;
    function addScore(target: ScoreboardIdentity | Entity | string, objective: string, value: number): number;
    function setScore(target: ScoreboardIdentity | Entity | string, objective: string, value: number): void;
    function resetScore(target: ScoreboardIdentity | Entity | string, objective: string): boolean;
}



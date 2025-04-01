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
    show(player: Player): Promise<ActionFormResponse>;
}

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

import { Player, RawMessage } from "@minecraft/server";
import { FormCancelationReason, ModalFormResponse } from "@minecraft/server-ui";
export declare class ModalFormBox {
    /** @private */ private form;
    /** @private */ private bodyText;
    /** @private */ private canSetBody;
    /** @private */ private callbacks;
    /** @private */ private cancelCallback;
    body(bodyText: string): ModalFormBox;
    cancel(callback: (player: Player, reason?: FormCancelationReason) => void): ModalFormBox;
    divider(): ModalFormBox;
    dropdown(
        label: RawMessage | string,
        options: (RawMessage | string)[],
        defaultValueIndex?: number,
        callback?: (player: Player, response: string) => void
    ): ModalFormBox;
    header(headerText: RawMessage | string): ModalFormBox;
    label(labelText: RawMessage | string): ModalFormBox;
    show(player: Player): Promise<ModalFormResponse>;
    slider(
        label: RawMessage | string,
        minimumValue: number,
        maximumValue: number,
        valueStep: number,
        defaultValue?: number,
        callback?: (player: Player, response: number) => void
    ): ModalFormBox;
    submitButton(submitButtonText: RawMessage | string): ModalFormBox;
    textField(
        label: RawMessage | string,
        placeholder?: RawMessage | string,
        defaultValue?: string,
        callback?: (player: Player, response: string) => void
    ): ModalFormBox;
    title(titleText: RawMessage | string): ModalFormBox;
    toggle(label: RawMessage | string, defaultValue?: boolean, callback?: (player: Player, response: boolean) => void): ModalFormBox;
    /** @private */ private formatLabel;
}

/** @type {ColorUtils} */
export declare namespace ColorUtils {
    const ESCAPE = "\u00A7";
    const MATCH_REGEXP: RegExp;
    function clean(text: string): string;
    function includesColor(text: string): boolean;
}

import { ItemLockMode, ItemStack, RGB, Vector3 } from "@minecraft/server";
/** @type {ItemStackUtils} */
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

import { Entity, ScoreboardIdentity, ScoreboardObjective } from "@minecraft/server";
/** @type {ScoreboardUtils} */
export declare namespace ScoreboardUtils {
    function addObjective(id: string, display?: string): ScoreboardObjective;
    function getObjective(id: string): ScoreboardObjective;
    function deleteObjective(id: string): boolean;
    function getScore(target: ScoreboardIdentity | Entity | string, objective: string): number | undefined;
    function addScore(target: ScoreboardIdentity | Entity | string, objective: string, value: number): number;
    function setScore(target: ScoreboardIdentity | Entity | string, objective: string, value: number): void;
    function resetScore(target: ScoreboardIdentity | Entity | string, objective: string): boolean;
}

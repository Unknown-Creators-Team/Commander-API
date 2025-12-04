import * as v from "lib/valibot.js";

// ========================================
// Form Schemas
// ========================================

// Form Actions
const AddTagActionSchema = v.object({
    typ: v.union([v.literal("at"), v.literal("add_t"), v.literal("add_tag")]),
    val: v.string(),
});

const RemoveTagActionSchema = v.object({
    typ: v.union([v.literal("rt"), v.literal("rem_t"), v.literal("remove_tag")]),
    val: v.string(),
});

const SetScoreActionSchema = v.object({
    typ: v.union([v.literal("ss"), v.literal("set_s"), v.literal("set_score")]),
    val: v.object({
        tgt: v.optional(v.string()),
        obj: v.string(),
        val: v.number(),
    }),
});

const AddScoreActionSchema = v.object({
    typ: v.union([v.literal("as"), v.literal("add_s"), v.literal("add_score")]),
    val: v.object({
        tgt: v.optional(v.string()),
        obj: v.string(),
        val: v.number(),
    }),
});

const RunCmdActionSchema = v.object({
    typ: v.union([v.literal("r"), v.literal("run"), v.literal("run_cmd"), v.literal("run_command")]),
    val: v.string(),
});

export const FormActionsSchema = v.union([AddTagActionSchema, RemoveTagActionSchema, SetScoreActionSchema, AddScoreActionSchema, RunCmdActionSchema]);

// Form Button
const FormButtonSchema = v.object({
    txt: v.string(),
    img: v.optional(v.string()),
    act: v.optional(FormActionsSchema),
});

// Form Action
const ActionFormSchema = v.object({
    typ: v.optional(v.union([v.literal("act"), v.literal("action")])),
    ttl: v.string(),
    bdy: v.string(),
    btn: v.array(FormButtonSchema),
});

// Form Message
const MessageFormSchema = v.object({
    typ: v.union([v.literal("msg"), v.literal("message")]),
    ttl: v.string(),
    bdy: v.string(),
    bt1: v.object({
        txt: v.string(),
        act: v.optional(FormActionsSchema),
    }),
    bt2: v.object({
        txt: v.string(),
        act: v.optional(FormActionsSchema),
    }),
});

// Form Modal Contents
const DropdownContentSchema = v.object({
    typ: v.union([v.literal("dd"), v.literal("dropdown")]),
    lbl: v.string(),
    opt: v.array(v.string()),
    def: v.optional(v.number()),
    act: v.optional(v.string()),
});

const SliderContentSchema = v.object({
    typ: v.union([v.literal("s"), v.literal("slider")]),
    lbl: v.string(),
    min: v.number(),
    max: v.number(),
    stp: v.number(),
    def: v.optional(v.number()),
    act: v.optional(v.string()),
});

const TextFieldContentSchema = v.object({
    typ: v.union([v.literal("tf"), v.literal("textField")]),
    lbl: v.string(),
    plh: v.string(),
    def: v.optional(v.string()),
    act: v.optional(v.string()),
});

const ToggleContentSchema = v.object({
    typ: v.union([v.literal("t"), v.literal("toggle")]),
    lbl: v.string(),
    def: v.optional(v.boolean()),
    act: v.optional(v.string()),
});

const ModalContentSchema = v.union([DropdownContentSchema, SliderContentSchema, TextFieldContentSchema, ToggleContentSchema]);

// Form Modal
const ModalFormSchema = v.object({
    typ: v.union([v.literal("mdl"), v.literal("modal")]),
    ttl: v.string(),
    cnt: v.array(ModalContentSchema),
});

export const FormSchema = v.union([ActionFormSchema, MessageFormSchema, ModalFormSchema]);

// ========================================
// Script Event Schemas
// ========================================

export const ExplosionSchema = v.object({
    radius: v.number(),
    location: v.optional(v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()]), v.union([v.number(), v.string()])])),
    dimension: v.optional(v.string()),
    options: v.optional(
        v.object({
            allow_under_water: v.optional(v.boolean()),
            breaks_blocks: v.optional(v.boolean()),
            causes_fire: v.optional(v.boolean()),
        })
    ),
});

export const ImpulseSchema = v.object({
    clear_velocity: v.optional(v.boolean()),
    vector: v.tuple([v.number(), v.number(), v.number()]),
});

export const KnockbackSchema = v.object({
    horizontal_force: v.tuple([v.number(), v.number()]),
    vertical_strength: v.number(),
});

export const TeleportSchema = v.object({
    location: v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()]), v.union([v.number(), v.string()])]),
    rotation: v.optional(v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()])])),
    dimension: v.optional(v.string()),
});

export const SpawnEntitySchema = v.object({
    id: v.string(),
    name: v.optional(v.string()),
    location: v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()]), v.union([v.number(), v.string()])]),
    dimension: v.optional(v.string()),
    fire: v.optional(v.number()),
});

const EnchantmentSchema = v.object({
    name: v.string(),
    level: v.optional(v.number()),
});

export const SpawnItemSchema = v.object({
    item: v.string(),
    name: v.optional(v.string()),
    amount: v.optional(v.number()),
    lore: v.optional(v.array(v.string())),
    enchants: v.optional(v.array(EnchantmentSchema)),
    can_place_on: v.optional(v.array(v.string())),
    can_destroy: v.optional(v.array(v.string())),
    lock: v.optional(v.string()),
    keep_on_death: v.optional(v.boolean()),
    location: v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()]), v.union([v.number(), v.string()])]),
    dimension: v.optional(v.string()),
    clear_velocity: v.optional(v.boolean()),
});

export const ShootSchema = v.object({
    id: v.string(),
    nameTag: v.optional(v.string()),
    fire: v.optional(v.number()),
    location: v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()]), v.union([v.number(), v.string()])]),
    vector: v.tuple([v.number(), v.number(), v.number()]),
    speed: v.optional(v.number()),
    dimension: v.optional(v.string()),
});

export const ScreenSchema = v.object({
    title: v.string(),
    subtitle: v.optional(v.string()),
    options: v.optional(
        v.object({
            in: v.number(),
            out: v.number(),
            stay: v.number(),
        })
    ),
});

export const SetItemSchema = v.object({
    id: v.string(),
    name: v.optional(v.string()),
    amount: v.optional(v.number()),
    slot: v.optional(v.number()),
    lore: v.optional(v.array(v.string())),
    enchants: v.optional(v.array(EnchantmentSchema)),
    can_place_on: v.optional(v.array(v.string())),
    can_destroy: v.optional(v.array(v.string())),
    lock: v.optional(v.string()),
    keep_on_death: v.optional(v.boolean()),
});

export const GetItemSchema = v.object({
    slot: v.optional(v.number()),
    minimize: v.optional(v.boolean()),
});

export const CallSchema = v.object({
    name: v.string(),
    args: v.optional(v.record(v.string(), v.any())),
});

// ========================================
// Type Exports
// ========================================

export type FormActions = v.InferOutput<typeof FormActionsSchema>;
export type Form = v.InferOutput<typeof FormSchema>;
export type Explosion = v.InferOutput<typeof ExplosionSchema>;
export type Impulse = v.InferOutput<typeof ImpulseSchema>;
export type Knockback = v.InferOutput<typeof KnockbackSchema>;
export type Teleport = v.InferOutput<typeof TeleportSchema>;
export type SpawnEntity = v.InferOutput<typeof SpawnEntitySchema>;
export type SpawnItem = v.InferOutput<typeof SpawnItemSchema>;
export type Shoot = v.InferOutput<typeof ShootSchema>;
export type Screen = v.InferOutput<typeof ScreenSchema>;
export type SetItem = v.InferOutput<typeof SetItemSchema>;
export type GetItem = v.InferOutput<typeof GetItemSchema>;
export type Call = v.InferOutput<typeof CallSchema>;

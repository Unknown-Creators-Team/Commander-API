import { Entity } from "@minecraft/server";
import * as v from "valibot";

// ========================================
// Utility Schemas
// ========================================

const LocationSchema = v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()]), v.union([v.number(), v.string()])]);

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

export const FormActionsSchema = v.variant("typ", [
    AddTagActionSchema,
    RemoveTagActionSchema,
    SetScoreActionSchema,
    AddScoreActionSchema,
    RunCmdActionSchema,
]);

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
    bdy: v.optional(v.string()),
    btn: v.array(FormButtonSchema),
});

// Form Message
export const MessageFormSchema = v.object({
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

const ModalContentSchema = v.variant("typ", [DropdownContentSchema, SliderContentSchema, TextFieldContentSchema, ToggleContentSchema]);

// Form Modal
const ModalFormSchema = v.object({
    typ: v.union([v.literal("mdl"), v.literal("modal")]),
    ttl: v.string(),
    cnt: v.array(ModalContentSchema),
});

export const FormSchema = v.variant("typ", [ActionFormSchema, MessageFormSchema, ModalFormSchema]);

// ========================================
// Script Event Schemas
// ========================================

export const ExplosionSchema = v.object({
    radius: v.number(),
    location: v.optional(LocationSchema),
    dimension: v.optional(v.string()),
    options: v.optional(
        v.object({
            allow_under_water: v.optional(v.boolean()),
            breaks_blocks: v.optional(v.boolean()),
            causes_fire: v.optional(v.boolean()),
        }),
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
    location: LocationSchema,
    rotation: v.optional(v.tuple([v.union([v.number(), v.string()]), v.union([v.number(), v.string()])])),
    dimension: v.optional(v.string()),
});

export const SpawnEntitySchema = v.object({
    id: v.string(),
    name: v.optional(v.string()),
    location: LocationSchema,
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
    location: LocationSchema,
    dimension: v.optional(v.string()),
    clear_velocity: v.optional(v.boolean()),
});

export const ShootSchema = v.object({
    id: v.string(),
    nameTag: v.optional(v.string()),
    fire: v.optional(v.number()),
    location: LocationSchema,
    vector: v.tuple([v.number(), v.number(), v.number()]),
    speed: v.optional(v.number()),
    dimension: v.optional(v.string()),
});

export const TitleSchema = v.object({
    title: v.string(),
    subtitle: v.optional(v.string()),
    options: v.optional(
        v.object({
            in: v.number(),
            out: v.number(),
            stay: v.number(),
        }),
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

export const DelaySchema = v.object({
    command: v.string(),
    ticks: v.number(),
});

export const ScreenSchema = v.variant("type", [
    v.object({
        type: v.union([v.literal("r"), v.literal("l")]),
        text: v.optional(v.string()),
    }),
    v.object({
        type: v.union([v.literal("tl"), v.literal("t"), v.literal("tr"), v.literal("bl"), v.literal("br")]),
        index: v.pipe(v.number(), v.minValue(1), v.maxValue(5)),
        text: v.optional(v.string()),
    }),
    v.object({
        type: v.literal("ca"),
    }),
]);

export const ParticleVector3Schema = v.object({
    x: v.number(),
    y: v.number(),
    z: v.number(),
});

export const ParticleRgbaSchema = v.object({
    r: v.number(),
    g: v.number(),
    b: v.number(),
    a: v.optional(v.number()),
});

export const ParticleSchema = v.object({
    id: v.string(),
    location: v.optional(LocationSchema),
    variables: v.optional(v.record(v.string(), v.union([v.number(), ParticleRgbaSchema, ParticleVector3Schema]))),
});

// ========================================
// Macro Schemas
// ========================================

// Tag Macro
export const TagMacroSchema = v.object({
    tag: v.string(),
});

// Score Macro
export const ScoreMacroSchema = v.object({
    score: v.string(),
});

// Velocity Macro
export const VelocityMacroSchema = v.object({
    velocity: v.union([v.literal("x"), v.literal("y"), v.literal("z"), v.literal("xy"), v.literal("xz"), v.literal("yz"), v.literal("xyz")]),
});

// Calc Macro
export const CalcMacroSchema = v.object({
    calc: v.string(),
});

// Selector Macro
export const SelectorMacroSchema = v.object({
    selector: v.object({
        c: v.optional(v.number()),
        r: v.optional(v.number()),
        rm: v.optional(v.number()),
        x: v.optional(v.number()),
        y: v.optional(v.number()),
        z: v.optional(v.number()),
        dx: v.optional(v.number()),
        dy: v.optional(v.number()),
        dz: v.optional(v.number()),
        tag: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
    }),
});

// If (Conditional) Macro
export const IfMacroSchema = v.object({
    if: v.tuple([
        v.pipe(v.string(), v.regex(/(.*?)(=|<|<=|!=)(.*)/, "Invalid condition format: =, <, <=, !=")), // condition
        v.union([v.string(), v.number(), v.boolean()]), // true value
        v.optional(v.union([v.string(), v.number(), v.boolean()])), // false value
    ]),
});

// Repeat Macro
export const RepeatMacroSchema = v.object({
    repeat: v.tuple([
        v.string(), // text
        v.number(), // count
    ]),
});

// Match Macro
export const MatchMacroSchema = v.object({
    match: v.tupleWithRest([v.number()], v.union([v.string(), v.number(), v.boolean()])),
});

// Pos Macro
export const PosMacroSchema = v.object({
    pos: v.union([v.string(), v.tuple([v.string(), v.number(), v.number(), v.number()]), v.tuple([v.string(), v.number()])]),
});

// Void Macro
export const VoidMacroSchema = v.object({
    void: v.string(),
});

// Fallback Macro
export const FallbackMacroSchema = v.object({
    fallback: v.tuple([
        v.union([v.string(), v.number(), v.boolean()]), // macro to expand
        v.union([v.string(), v.number(), v.boolean()]), // fallback value
    ]),
});

/**
 * - at
 * - concat
 * - starts_with
 * - ends_with
 * - includes
 * - index_of
 * - repeat
 * - replace
 * - replace_all
 * - slice
 * - lower_case
 * - upper_case
 * - trim
 * - trim_end
 * - trim_start
 * - pad_start
 * - pad_end
 * - length
 */
export const StrMacroAtSchema = v.strictTuple([v.string(), v.literal("at"), v.number()]);
export const StrMacroConcatSchema = v.tupleWithRest([v.string(), v.literal("concat")], v.string());
export const StrMacroStartsWithSchema = v.strictTuple([
    v.string(),
    v.literal("starts_with"),
    v.string(),
    v.string(),
    v.optional(v.string()),
]);
export const StrMacroEndsWithSchema = v.strictTuple([v.string(), v.literal("ends_with"), v.string(), v.string(), v.optional(v.string())]);
export const StrMacroIncludesSchema = v.strictTuple([v.string(), v.literal("includes"), v.string(), v.string(), v.optional(v.string())]);
export const StrMacroIndexOfSchema = v.strictTuple([v.string(), v.literal("index_of"), v.string()]);
export const StrMacroRepeatSchema = v.strictTuple([v.string(), v.literal("repeat"), v.number()]);
export const StrMacroReplaceSchema = v.strictTuple([v.string(), v.literal("replace"), v.string(), v.string()]);
export const StrMacroReplaceAllSchema = v.strictTuple([v.string(), v.literal("replace_all"), v.string(), v.string()]);
export const StrMacroSliceSchema = v.strictTuple([v.string(), v.literal("slice"), v.number(), v.optional(v.number())]);
export const StrMacroLowerCaseSchema = v.strictTuple([v.string(), v.literal("lower_case")]);
export const StrMacroUpperCaseSchema = v.strictTuple([v.string(), v.literal("upper_case")]);
export const StrMacroTrimSchema = v.strictTuple([v.string(), v.literal("trim")]);
export const StrMacroTrimEndSchema = v.strictTuple([v.string(), v.literal("trim_end")]);
export const StrMacroTrimStartSchema = v.strictTuple([v.string(), v.literal("trim_start")]);
export const StrMacroPadStartSchema = v.strictTuple([v.union([v.string(), v.number()]), v.literal("pad_start"), v.number(), v.optional(v.union([v.string(), v.number()]))]);
export const StrMacroPadEndSchema = v.strictTuple([v.union([v.string(), v.number()]), v.literal("pad_end"), v.number(), v.optional(v.union([v.string(), v.number()]))]);
export const StrMacroLengthSchema = v.strictTuple([v.string(), v.literal("length")]);

export const StrMacroSchema = v.object({
    str: v.union([
        StrMacroAtSchema,
        StrMacroConcatSchema,
        StrMacroStartsWithSchema,
        StrMacroEndsWithSchema,
        StrMacroIncludesSchema,
        StrMacroIndexOfSchema,
        StrMacroRepeatSchema,
        StrMacroReplaceSchema,
        StrMacroReplaceAllSchema,
        StrMacroSliceSchema,
        StrMacroLowerCaseSchema,
        StrMacroUpperCaseSchema,
        StrMacroTrimSchema,
        StrMacroTrimEndSchema,
        StrMacroTrimStartSchema,
        StrMacroPadStartSchema,
        StrMacroPadEndSchema,
        StrMacroLengthSchema,
    ]),
});

// ========================================
// Slash Command Schemas
// ========================================

// se Command
export const ScriptEventCommandSchema = v.tupleWithRest(
    [v.string()], // id
    v.string(), // args
);

// exec Command
export const ExecCommandSchema = v.tupleWithRest(
    [v.custom<Entity[]>((e) => ((e as Entity[]).length > 0 ? (e as Entity[])[0] instanceof Entity : true)), v.string()], // target, id
    v.string(), // args
);

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
export type Title = v.InferOutput<typeof TitleSchema>;
export type SetItem = v.InferOutput<typeof SetItemSchema>;
export type GetItem = v.InferOutput<typeof GetItemSchema>;
export type Call = v.InferOutput<typeof CallSchema>;
export type Delay = v.InferOutput<typeof DelaySchema>;
export type Screen = v.InferOutput<typeof ScreenSchema>;
export type TagMacro = v.InferOutput<typeof TagMacroSchema>;
export type ScoreMacro = v.InferOutput<typeof ScoreMacroSchema>;
export type VelocityMacro = v.InferOutput<typeof VelocityMacroSchema>;
export type CalcMacro = v.InferOutput<typeof CalcMacroSchema>;
export type SelectorMacro = v.InferOutput<typeof SelectorMacroSchema>;
export type IfMacro = v.InferOutput<typeof IfMacroSchema>;
export type RepeatMacro = v.InferOutput<typeof RepeatMacroSchema>;
export type MatchMacro = v.InferOutput<typeof MatchMacroSchema>;
export type PosMacro = v.InferOutput<typeof PosMacroSchema>;
export type FallbackMacro = v.InferOutput<typeof FallbackMacroSchema>;
export type ScriptEventCommand = v.InferOutput<typeof ScriptEventCommandSchema>;
export type ExecCommand = v.InferOutput<typeof ExecCommandSchema>;

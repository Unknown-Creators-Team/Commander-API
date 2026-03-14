import { ScoreboardDatabase } from "lib/DatabaseMC.js";

export const original = Object.freeze({
    format: 11,
    basic: {
        tag: {
            enabled: true,
            ticks: 10,
        },
        debug: {
            enabled: false,
            log: false,
            info: false,
            warn: false,
            error: false,
        },
        tests: {
            enabled: false,
            events: false,
            scriptevents: false,
        },
    },
    events: {
        buttonPush: {
            enabled: true,
            inline: false,
            name: "button",
        },
        chatSend: {
            enabled: true,
            inline: false,
            name: "chat",
        },
        entityDie: {
            enabled: true,
            inline: false,
            // name: "entityDie",
        },
        entityHitBlock: {
            enabled: true,
            inline: false,
            name: "attack",
        },
        entityHitEntity: {
            enabled: true,
            inline: false,
            name: "attack",
        },
        entityHurt: {
            enabled: true,
            inline: false,
            // name: "entityHurt",
        },
        itemUse: {
            enabled: true,
            inline: false,
            name: "item_use",
        },
        itemUseOn: {
            enabled: true,
            inline: false,
            name: "item_use_on",
        },
        playerBreakBlock: {
            enabled: true,
            inline: false,
            name: "break",
        },
        playerInteractWithBlock: {
            enabled: true,
            inline: false,
            name: "interact",
        },
        playerInteractWithEntity: {
            enabled: true,
            inline: false,
            name: "interact",
        },
        playerLeave: {
            enabled: true,
            inline: false,
            // name: "playerLeave",
        },
        playerPlaceBlock: {
            enabled: true,
            inline: false,
            name: "place",
        },
        playerSpawn: {
            enabled: true,
            inline: false,
            name: "spawn",
        },
        pressurePlatePop: {
            enabled: true,
            inline: false,
            name: "plate",
        },
        pressurePlatePush: {
            enabled: true,
            inline: false,
            name: "plate",
        },
        projectileHitBlock: {
            enabled: true,
            inline: false,
            name: "hit",
        },
        projectileHitEntity: {
            enabled: true,
            inline: false,
            name: "hit",
        },
        projectileShoot: {
            enabled: true,
            inline: false,
            name: "shot",
        },
        scores: {
            enabled: true,
            inline: false,
            name: "scores",
        },
        velocity: {
            enabled: true,
            inline: true,
            name: "velocity",
        },
        viewDirection: {
            enabled: true,
            inline: true,
            name: "direction",
        },
        movementVector: {
            enabled: true,
            inline: true,
            name: "input",
        },
        health: {
            enabled: true,
            inline: true,
            name: "health",
        },
        location: {
            enabled: true,
            inline: true,
            name: "location",
        },
        rotation: {
            enabled: true,
            inline: true,
            name: "rotation",
        },
        blockFromViewDirection: {
            enabled: true,
            inline: true,
            name: "view",
        },
        entityFromViewDirection: {
            enabled: true,
            inline: true,
            name: "view",
        },
        selectedSlotIndex: {
            enabled: true,
            inline: true,
            name: "slot",
        },
        timestamp: {
            enabled: true,
            inline: true,
            name: "timestamp",
        },
        dimension: {
            enabled: true,
            inline: true,
            name: "dimension",
        },
        maxRenderDistance: {
            enabled: true,
            inline: true,
            name: "max_render_distance",
        },
        memoryTier: {
            enabled: true,
            inline: true,
            name: "memory_tier",
        },
        level: {
            enabled: true,
            inline: true,
            name: "level",
        },
        totalXp: {
            enabled: true,
            inline: true,
            name: "total_xp",
        },
        totalXpNeededForNextLevel: {
            enabled: true,
            inline: true,
            name: "xp_needed_for_next_level",
        },
        xpEarnedAtCurrentLevel: {
            enabled: true,
            inline: true,
            name: "xp_earned_at_current_level",
        },
        timeOfDay: {
            enabled: true,
            inline: true,
            name: "time",
        },
        day: {
            enabled: true,
            inline: true,
            name: "day",
        },
        absoluteTime: {
            enabled: true,
            inline: true,
            name: "absolute_time",
        },
        defaultSpawnLocation: {
            enabled: true,
            inline: true,
            name: "default_spawn_location",
        },
        difficulty: {
            enabled: true,
            inline: true,
            name: "difficulty",
        },
        isHardcore: {
            enabled: true,
            inline: true,
            name: "hardcore",
        },
        currentTick: {
            enabled: true,
            inline: true,
            name: "current_tick",
        },
        isEditorWorld: {
            enabled: true,
            inline: true,
            name: "editor_world",
        },
        systemMemoryTier: {
            enabled: true,
            inline: true,
            name: "memory_tier",
        },
        isCapiExtensionLoaded: {
            enabled: true,
            inline: true,
            name: "capi_extension_loaded",
        },
        isCapiScreenLoaded: {
            enabled: true,
            inline: true,
            name: "capi_screen_loaded",
        },
        tags: {
            enabled: true,
            inline: false,
            name: "tags",
        },
        isOp: {
            enabled: true,
            inline: true,
            name: "op",
        },
        isMember: {
            enabled: true,
            inline: true,
            name: "member",
        },
        isVisitor: {
            enabled: true,
            inline: true,
            name: "visitor",
        },
        isFlying: {
            enabled: true,
            inline: true,
            name: "fly",
        },
        isGliding: {
            enabled: true,
            inline: true,
            name: "glide",
        },
        isJumping: {
            enabled: true,
            inline: true,
            name: "jump",
        },
        isClimbing: {
            enabled: true,
            inline: true,
            name: "climb",
        },
        isFalling: {
            enabled: true,
            inline: true,
            name: "fall",
        },
        isInWater: {
            enabled: true,
            inline: true,
            name: "in_water",
        },
        isOnGround: {
            enabled: true,
            inline: true,
            name: "on_ground",
        },
        isSneaking: {
            enabled: true,
            inline: true,
            name: "sneak",
        },
        isSprinting: {
            enabled: true,
            inline: true,
            name: "sprint",
        },
        isSwimming: {
            enabled: true,
            inline: true,
            name: "swim",
        },
        isSleeping: {
            enabled: true,
            inline: true,
            name: "sleep",
        },
        isEmoting: {
            enabled: true,
            inline: true,
            name: "emote",
        },
        isRiding: {
            enabled: true,
            inline: true,
            name: "ride",
        },
        isDesktop: {
            enabled: true,
            inline: true,
            name: "desktop",
        },
        isMobile: {
            enabled: true,
            inline: true,
            name: "mobile",
        },
        isConsole: {
            enabled: true,
            inline: true,
            name: "console",
        },
        isGraphicsSimple: {
            enabled: true,
            inline: true,
            name: "graphics_simple",
        },
        isGraphicsFancy: {
            enabled: true,
            inline: true,
            name: "graphics_fancy",
        },
        isGraphicsDeferred: {
            enabled: true,
            inline: true,
            name: "graphics_deferred",
        },
        isGraphicsRayTraced: {
            enabled: true,
            inline: true,
            name: "graphics_ray_traced",
        },
        view: {
            enabled: true,
            inline: true,
            name: "view",
            options: {
                includeLiquidBlocks: true,
                includePassableBlocks: true,
                maxDistance: 100,
            },
        },
        tripWireTrip: {
            enabled: true,
            inline: false,
            name: "trip_wire_trip",
        },
    },
    scriptevents: {
        rename: {
            enabled: true,
            name: "rename",
        },
        reset_name: {
            enabled: true,
            name: "reset_name",
        },
        set_item: {
            enabled: true,
            name: "set_item",
        },
        form: {
            enabled: true,
            name: "form",
        },
        explosion: {
            enabled: true,
            name: "explosion",
        },
        spawn_entity: {
            enabled: true,
            name: "spawn_entity",
        },
        spawn_item: {
            enabled: true,
            name: "spawn_item",
        },
        say: {
            enabled: true,
            name: "say",
        },
        tp: {
            enabled: true,
            name: "tp",
        },
        run: {
            enabled: true,
            name: "run",
        },
        set_slot: {
            enabled: true,
            name: "set_slot",
        },
        tell: {
            enabled: true,
            name: "tell",
        },
        kick: {
            enabled: true,
            name: "kick",
        },
        kill: {
            enabled: true,
            name: "kill",
        },
        knockback: {
            enabled: true,
            name: "knockback",
        },
        impulse: {
            enabled: true,
            name: "impulse",
        },
        shoot: {
            enabled: true,
            name: "shoot",
        },
        title: {
            enabled: true,
            name: "title",
        },
        actionbar: {
            enabled: true,
            name: "actionbar",
        },
        get_item: {
            enabled: true,
            name: "get_item",
        },
        call: {
            enabled: true,
            name: "call",
        },
        delay: {
            enabled: true,
            name: "delay",
        },
        test: {
            enabled: true,
            name: "test",
        },
        team: {
            enabled: true,
            name: "team",
        },
        size: {
            enabled: true,
            name: "size",
        },
        attack: {
            enabled: true,
            name: "attack",
        },
        max_health: {
            enabled: true,
            name: "max_health",
        },
        screen: {
            enabled: true,
            name: "screen",
        },
        health: {
            enabled: true,
            name: "health",
        },
        particle: {
            enabled: true,
            name: "particle",
        },
    },
    slashCommands: {
        exec: {
            enabled: true,
        },
        se: {
            enabled: true,
        },
    },
    others: {
        extensions: {
            "Commander-API-Extension": {
                forceUse: false,
            },
            "Commander-API-Screen": {
                forceUse: false,
            },
        },
        leave: {
            enabled: false,
            message: "",
        },
        cancelChat: {
            enabled: false,
            pattern: "",
        },
        customChat: {
            enabled: false,
            format: "[<!fallback=[<!tag=rank>,'Member']>] <!name>: {msg}",
            websocket: false,
        },
        privateChat: {
            enabled: false,
            format: "[Team {id}] <!name>: {msg}",
            objective: "capi:private_chat",
        },
    },
});

class Config {
    private static readonly dbName = "CAPI_CONFIG";
    private static readonly db = new ScoreboardDatabase(Config.dbName);
    private static dynamic: typeof original;
    public readonly format: typeof original.format;
    public readonly basic: typeof original.basic;
    public readonly events: typeof original.events;
    public readonly scriptevents: typeof original.scriptevents;
    public readonly slashCommands: typeof original.slashCommands;
    public readonly others: typeof original.others;
    public updated = false;

    constructor() {
        if (Config.db.size === 0) Config.Reset();
        this.updated = false;

        Config.dynamic = Config.Encode(Object.fromEntries(Config.db.entries()) as any) as typeof original;

        this.format = Config.dynamic.format;
        this.basic = Config.dynamic.basic;
        this.events = Config.dynamic.events;
        this.scriptevents = Config.dynamic.scriptevents;
        this.slashCommands = Config.dynamic.slashCommands;
        this.others = Config.dynamic.others;
    }

    public Reset() {
        Config.Reset();
        this.updated = true;
    }

    public Update(newConfig: typeof original) {
        Config.Reset();
        for (const [key, value] of Object.entries(Config.Decode(newConfig))) {
            if (value !== undefined) Config.db.set(key, value);
        }
        this.updated = true;
    }

    public Migrate(newConfig: typeof original) {
        Config.Migrate(newConfig);
        this.updated = true;
    }

    private static Reset() {
        for (const keys of this.db.keys()) {
            this.db.delete(keys);
        }
        for (const [key, value] of Object.entries(this.Decode(original))) {
            this.db.set(key, value);
        }
    }

    private static Migrate(config: typeof original) {
        this.Reset();
        for (const [key, value] of Object.entries(this.Decode(config))) {
            if (key === "format") continue;
            this.db.set(key, value);
        }
    }

    private static Encode<T extends string | number | boolean | symbol | undefined>(obj: Record<string, T>): any {
        return Object.entries(obj).reduce((acc, [path, value]) => {
            const keys = path.split(".");
            keys.reduce((a, key, i) => {
                if (i === keys.length - 1) {
                    a[key] = value;
                } else {
                    if (!a[key]) {
                        const nextKey = keys[i + 1];
                        a[key] = isNaN(Number(nextKey)) ? {} : [];
                    }
                }
                return a[key];
            }, acc);
            return acc;
        }, {} as any);
    }

    private static Decode<T extends string | number | boolean | symbol | undefined>(obj: any, parent = ""): Record<string, T> {
        return Object.keys(obj).reduce((acc, key) => {
            const value = obj[key];
            const path = parent ? `${parent}.${key}` : key;
            if (typeof value === "object") {
                return { ...acc, ...this.Decode(value, path) };
            }
            return { ...acc, [path]: value };
        }, {});
    }
}

export default new Config();

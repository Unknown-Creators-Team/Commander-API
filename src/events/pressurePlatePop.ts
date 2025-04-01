import { world } from "@minecraft/server";
import config from "data/config.js";
import { ScoreboardUtils } from "lib/ScriptBoxMC.js";

world.afterEvents.pressurePlatePop.subscribe((pressurePlatePop) => {
    const { block } = pressurePlatePop;

    const entity = block.dimension.getEntities({ location: block.location, closest: 1 })[0];

    if (entity.isPlayer()) {
        ScoreboardUtils.setScore(entity, `capi:${config.events.pressurePlatePop.name}_x`, block.location.x);
        ScoreboardUtils.setScore(entity, `capi:${config.events.pressurePlatePop.name}_y`, block.location.y);
        ScoreboardUtils.setScore(entity, `capi:${config.events.pressurePlatePop.name}_z`, block.location.z);

        entity.addTagWillRemove(`capi:${config.events.pressurePlatePop.name}`);
    }
});

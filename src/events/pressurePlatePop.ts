import { world } from "@minecraft/server";
import { setScore } from "util.js";

world.afterEvents.pressurePlatePop.subscribe(pressurePlatePop => {
    const { block } = pressurePlatePop;
    
    const entity = block.dimension.getEntities({ location: block.location, closest: 1 })[0];

    if (entity.isPlayer()) {
        setScore(entity, "capi:plate_x", block.location.x);
        setScore(entity, "capi:plate_y", block.location.y);
        setScore(entity, "capi:plate_z", block.location.z);

        entity.addTagWillRemove("capi:plate_pop");
    }

});
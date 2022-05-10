import { ProtEntityType } from "@ysparadox/ysproto";
import Long from "long";

const AVATAR_ID_OFFSET = 10000000;
const DEPOT_ID_OFFSET = 1;
const DEPOT_ID_MUL = 100;
const ENTITY_ID_OFFSET = 24;
const ENTITY_ID_MASK = ((1 << ENTITY_ID_OFFSET)-1);

const checkCharId = (characterId: number) => {
    if (characterId > 100) {
        throw Error(`Invalid characterId ${characterId}`);
    }
}

export function getAvatarByCharId(characterId: number) {
    checkCharId(characterId);
    return characterId + AVATAR_ID_OFFSET;
}

export function getDepotIdByCharId(characterId: number) {
    checkCharId(characterId);
    const offset = characterId == 5 || characterId == 7 ? 4 : DEPOT_ID_OFFSET;
    console.log("HACK: main hero is fixed to wind");

    return characterId * DEPOT_ID_MUL + offset;
}

export function getEntityTypeById(entityId: number) {
    const ent = ProtEntityType[entityId];
    if (!ent) throw Error(`Invalid entity ID ${entityId}`);

    return ent;
}

export function getEntityIdByTypeSub(t: ProtEntityType, subId: number) {
    return (t << ENTITY_ID_OFFSET) | (subId & ENTITY_ID_MASK);
}
export function getGuidByUidId(uid: number, id: number): Long {
    const uidL = Long.fromNumber(uid);
    return uidL.shl(32).or(id);
}
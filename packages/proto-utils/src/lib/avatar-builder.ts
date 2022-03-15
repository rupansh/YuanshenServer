import { AvatarInfo, GameDb, IdManager } from "@ysparadox/game-db";
import * as proto from "@ysparadox/ysproto";
import { AvatarFetterInfo, PropType } from "@ysparadox/ysproto";
import { isNone, Option } from "fp-ts/lib/Option";
import * as AvatarSkillDepot from "../../../../assets/json/AvatarSkillDepotExcelConfigData.json";
import { propTypeRemap } from "./remapper";

const unwrap = <T>(o: Option<T>) => {
    if (isNone(o)) throw Error("couldn't unwrap option");
    return o.value;
}

export async function buildAvatarInfo(db: GameDb, a: AvatarInfo): Promise<proto.AvatarInfo> {
    const depo = IdManager.getDepotIdByCharId(a.characterId);
    const asd = AvatarSkillDepot[depo];
    const asl = await db.getSkillLevels(a.guid).then(unwrap);

    const slm = asd.EnergySkill && asl[asd.EnergySkill] ? {
        [asd.EnergySkill]: asl[asd.EnergySkill]
    } : {};

    const ap = await db.getAvatarProps(a.guid).then(unwrap);
    const afp = await db.getAvatarFightProps(a.guid).then(unwrap);

    const pli = PropType.PROP_BREAK_LEVEL;
    const promoteLevel = ap[pli] || 0;

    const ips = asd.InherentProudSkillOpens.flatMap((s) => {
        if (!("ProudSkillGroupId" in s && s.ProudSkillGroupId)) return []
        if (s.NeedAvatarPromoteLevel && s.NeedAvatarPromoteLevel <= promoteLevel)  return [];

        // Hack, read ProudSkillExcelConfigData
        return [s.ProudSkillGroupId * 100  + 1];
    });

    const afi = AvatarFetterInfo.create({
        expLevel: 1,
        // TODO: Fill rest
    });

    const egi = (await db.getAvatarEquip(a.guid).then(unwrap)).map((g) => BigInt(g.toString()));

    // Hack
    const fakeProudSkillExtraLevelMap = { 732: 3, 739: 3 };

    return proto.AvatarInfo.create({
        avatarId: IdManager.getAvatarByCharId(a.characterId),
        avatarType: a.avatarType,
        guid: BigInt(a.guid.toString()),
        bornTime: a.bornTime,
        skillDepotId: asd.Id,
        talentIdList: asd.Talents,
        propMap: propTypeRemap(ap),
        fightPropMap: afp,
        fetterInfo: afi,
        equipGuidList: egi,
        inherentProudSkillList: ips,
        skillLevelMap: slm,
        proudSkillExtraLevelMap: fakeProudSkillExtraLevelMap,
        wearingFlycloakId: 140001, // Hack
        lifeState: 1
    })
}
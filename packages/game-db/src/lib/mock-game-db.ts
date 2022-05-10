import { PlayerInfo } from "./model/player-info";
import * as proto from "@ysparadox/ysproto";
import { PropType, FightPropType, OPEN_STATE_TYPE } from "@ysparadox/ysproto";
import { none, Option, some } from "fp-ts/lib/Option";
import * as IdManager from "./id-manager";
import { SPOOF_UID } from "@ysparadox/auth-manager";
import Long from "long";
import { AvatarInfo, SceneInfo, TeamInfo, AvatarTeamInfo, TeamSelectionInfo } from "./model";


const FAKE_NAME = "YSParadoxEnjoyer";
const FAKE_SIG = "YSParadox Bruh Moment";
const FAKE_NAMECARD = 1337;
export const FAKE_AVATAR_ID = 1337;
const FAKE_PLAYER_LEVEL = 56;
const FAKE_WORLD_LEVEL = 8;
export const FAKE_WEAPON_ID = 2;
const FAKE_SCENE_ID = 3;
export const FAKE_TEAM_ID = 4;
export const FAKE_MP_LEVEL_ID = 5;
const FAKE_AVATAR_GUID = Long.fromString("2400000000000001", true, 16);
const FAKE_SCENE_TOKEN = 0x1234;

const FAKE_PLAYER_PROPS: Partial<Record<PropType, number>> = {
    [PropType.PROP_IS_SPRING_AUTO_USE]: 1,
    [PropType.PROP_IS_FLYABLE]: 1,
    [PropType.PROP_IS_TRANSFERABLE]: 1,
    [PropType.PROP_PLAYER_LEVEL]: FAKE_PLAYER_LEVEL,
    [PropType.PROP_PLAYER_EXP]: 1337,
    [PropType.PROP_PLAYER_HCOIN]: 9001,
    [PropType.PROP_PLAYER_SCOIN]: 9002,
    [PropType.PROP_PLAYER_LEVEL_LOCK_ID]: FAKE_WORLD_LEVEL,
    [PropType.PROP_PLAYER_RESIN]: 159,
    [PropType.PROP_MAX_STAMINA]: 12000,
    [PropType.PROP_CUR_PERSIST_STAMINA]: 12000
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export function mockGameDb() {
    return {
        getPlayerInfo(uid: number): Promise<Option<PlayerInfo>> {
            return Promise.resolve(some({
                uid,
                nickName: FAKE_NAME,
                signature: FAKE_SIG,
                birthday: new Date(0),
                namecardId: FAKE_NAMECARD,
                finishAchievementNum: 1,
                towerFloorIndex: 1,
                towerLevelIndex: 1,
                avatarId: FAKE_AVATAR_ID
            }))
        },
        async getPlayerProps(_: number) {
            return some(FAKE_PLAYER_PROPS);
        },
        async getPlayerLevel(_: number) {
            return some(FAKE_PLAYER_LEVEL);
        },
        async getPlayerWorldLevel(_: number) {
            return some(FAKE_WORLD_LEVEL);
        },
        async getPlayerProp(_: number, propId: PropType) {
            const prop = FAKE_PLAYER_PROPS[propId];
            return prop ? some(prop) : none;
        },
        async getAvatarProps(_: Long) {
            const ret: Partial<Record<PropType, number>> = {
                [PropType.PROP_EXP]: 0,
                [PropType.PROP_LEVEL]: 80,
                [PropType.PROP_BREAK_LEVEL]: 5
            };

            return some(ret);
        },
        async getAvatarEquip(_: Long) {
            const equip = [
                IdManager.getGuidByUidId(
                    SPOOF_UID,
                    FAKE_WEAPON_ID
                )
            ];
            return some(equip);
        },
        async getSkillLevels(_: Long) {
            return some({
                10068: 3,
                100553: 3,
                10067: 3
            } as Record<number, number>);
        },
        async getAvatarFightProps(_: Long) {
            const ret: Partial<Record<FightPropType, number>> = {
                [FightPropType.FIGHT_PROP_BASE_HP]: 9000.0,
                [FightPropType.FIGHT_PROP_HP]: 3000.0,
                [FightPropType.FIGHT_PROP_HP_PERCENT]: 0.0746000,
                [FightPropType.FIGHT_PROP_BASE_ATTACK]: 600.0,
                [FightPropType.FIGHT_PROP_ATTACK]: 50.0,
                [FightPropType.FIGHT_PROP_ATTACK_PERCENT]: 0.4,
                [FightPropType.FIGHT_PROP_BASE_DEFENSE]: 600.0,
                [FightPropType.FIGHT_PROP_DEFENSE]: 40.0,
                [FightPropType.FIGHT_PROP_DEFENSE_PERCENT]: 0.04,
                [FightPropType.FIGHT_PROP_CRITICAL]: 0.99,
                [FightPropType.FIGHT_PROP_ANTI_CRITICAL]: 0.00000,
                [FightPropType.FIGHT_PROP_CRITICAL_HURT]: 0.99,
                [FightPropType.FIGHT_PROP_CHARGE_EFFICIENCY]: 1.337,
                [FightPropType.FIGHT_PROP_HEAL_ADD]: 0.00000,
                [FightPropType.FIGHT_PROP_HEALED_ADD]: 0.00000,
                [FightPropType.FIGHT_PROP_ELEMENT_MASTERY]: 42.0,
                [FightPropType.FIGHT_PROP_PHYSICAL_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_PHYSICAL_ADD_HURT]: 0.271828,
                [FightPropType.FIGHT_PROP_FIRE_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_ELEC_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_WATER_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_GRASS_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_WIND_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_ROCK_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_ICE_ADD_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_FIRE_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_ELEC_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_WATER_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_GRASS_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_WIND_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_ROCK_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_ICE_SUB_HURT]: 0.00000,
                [FightPropType.FIGHT_PROP_MAX_WIND_ENERGY]: 60.0000,
                [FightPropType.FIGHT_PROP_CUR_WIND_ENERGY]: 60.0000,
                [FightPropType.FIGHT_PROP_CUR_HP]: 10000.0,
                [FightPropType.FIGHT_PROP_MAX_HP]: 12000.0,
                [FightPropType.FIGHT_PROP_CUR_ATTACK]: 900.0,
                [FightPropType.FIGHT_PROP_CUR_DEFENSE]: 700.0,
                [FightPropType.FIGHT_PROP_CUR_SPEED]: 10.00000,
            };

            return some(ret);
        },
        async getOpenState(_: number) {
            const ret: Partial<Record<OPEN_STATE_TYPE, number>> = {
                [OPEN_STATE_TYPE.OPEN_STATE_PAIMON]: 1,

                [OPEN_STATE_TYPE.OPEN_STATE_PLAYER_LVUP_GUIDE]: 1,
    
                [OPEN_STATE_TYPE.OPEN_STATE_GACHA]: 1,
                [OPEN_STATE_TYPE.OPEN_STATE_GUIDE_GACHA]: 1,
                [OPEN_STATE_TYPE.OPEN_STATE_GUIDE_TEAM]: 1,
    
                [OPEN_STATE_TYPE.OPEN_STATE_GUIDE_BAG]: 1,
    
                [OPEN_STATE_TYPE.OPEN_STATE_LIMIT_REGION_FRESHMEAT]: 1,
                [OPEN_STATE_TYPE.OPEN_STATE_LIMIT_REGION_GLOBAL]: 1,
                [OPEN_STATE_TYPE.OPEN_STATE_MULTIPLAYER]: 1,
    
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_PAIMON]: 1, // 900
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_CITY]: 1, // 901
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_BLACKSMITH]: 1, // 902
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_GROCERY]: 1, // 903
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_FOOD]: 1,
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_SEA_LAMP]: 1,
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_LIYUE_GROCERY]: 1, // 903
                [OPEN_STATE_TYPE.OPEN_STATE_SHOP_TYPE_LIYUE_RESTAURANT]: 1, // 903
    
                [OPEN_STATE_TYPE.OPEN_ADVENTURE_MANUAL]: 1, // 1100
                [OPEN_STATE_TYPE.OPEN_ADVENTURE_MANUAL_MONSTER]: 1, // 1103
                [OPEN_STATE_TYPE.OPEN_ADVENTURE_MANUAL_BOSS_DUNGEON]: 1, // 1104
            };

            return some(ret);
        },
        async getInventory(uid: number) {
            const weapon = proto.Weapon.create({
                level: 70,
                promoteLevel: 4,
                affixMap: { 111406: 0 }
            });
            const equip = proto.Equip.create({
                isLocked: true,
                detail: { oneofKind: "weapon", weapon }
            });
            const item = proto.Item.create({
                itemId: 11406,
                guid: BigInt(IdManager.getGuidByUidId(uid, FAKE_WEAPON_ID).toString()),
                detail: { oneofKind: "equip", equip }
            });

            return some([item])
        },
        async getAvatars(uid: number) {
            const ret: AvatarInfo = {
                uid,
                characterId: 7,
                avatarType: 1,
                guid: FAKE_AVATAR_GUID,
                bornTime: 1633790000
            }

            return some([ret]);
        },
        async getAvatar(guid: Long) {
            const ret: AvatarInfo = {
                uid: SPOOF_UID,
                characterId: 7,
                avatarType: 1,
                guid,
                bornTime: 1633790000
            };

            return some(ret);
        },
        async getPlayerSceneInfo(uid: number) {
            const ret: SceneInfo = {
                uid,
                sceneId: FAKE_SCENE_ID,
                sceneToken: FAKE_SCENE_TOKEN,
                pos: [-3400.0, 233.0, -3427.6]
            };

            return some(ret);
        },
        async getPlayerTeams(uid: number) {
            return some(Array.from({ length: 4 }, function(_, i): TeamInfo {
                return {
                    uid,
                    id: i+1,
                    name: `Team ${i+1}`
                }
            }));
        },
        async getPlayerTeamsAvatars(uid: number) {
            return some(Array.from<unknown, AvatarTeamInfo>({ length: 4 }, (_, i) => ({
                uid,
                teamId: i+1,
                guid: FAKE_AVATAR_GUID
            })));
        },
        async getPlayerTeamSelection(uid: number) {
            const ret: TeamSelectionInfo = {
                uid,
                avatar: FAKE_AVATAR_GUID,
                team: 1
            };

            return some(ret);
        }
    }
}
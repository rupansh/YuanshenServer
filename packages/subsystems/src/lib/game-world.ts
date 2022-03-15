import { FAKE_AVATAR_ID, FAKE_MP_LEVEL_ID, FAKE_TEAM_ID, FAKE_WEAPON_ID, GameDb, IdManager } from "@ysparadox/game-db";
import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { buildAvatarInfo, fightPropMapToPair, propTypeMapToPair, unwrap } from "@ysparadox/proto-utils";
import { AbilitySyncStateInfo, AnimatorParameterValueInfo, AnimatorParameterValueInfoPair, AvatarEnterSceneInfo, EnterSceneDoneRsp, EnterSceneReadyRsp, EnterWorldAreaRsp, EntityAuthorityInfo, MotionInfo, MPLevelEntityInfo, MpSettingType, OnlinePlayerInfo, PingRsp, PostEnterSceneRsp, PropType, PropValue, ProtEntityType, SceneAvatarInfo, SceneEntityAiInfo, SceneEntityInfo, SceneInitFinishRsp, ScenePlayerInfo, SceneTeamAvatar, SceneWeaponInfo, TeamEnterSceneInfo, Vector, VisionType } from "@ysparadox/ysproto";
import { FAKE_DEFAULT_ABILITIES } from "./consts";

export function registerGameWorld(reg: PacketHandlerRegistry, db: GameDb) {
    async function fakeSceneDefaultAvatar(userId: number): Promise<SceneEntityInfo> {
        const user = await db.getPlayerSceneInfo(userId).then(unwrap)
        const avatar = await db.getPlayerTeamSelection(userId).then(unwrap);
        const dbAvatarInfo = await db.getAvatar(avatar.avatar).then(unwrap);
        const avatarInfo = await buildAvatarInfo(db, dbAvatarInfo);
        const avatarProps = await db.getAvatarProps(avatar.avatar).then(unwrap);
        const fightProps = await db.getAvatarFightProps(avatar.avatar).then(unwrap);

        const motionInfo = MotionInfo.create({
            pos: { x: user.pos[0], y: user.pos[1], z: user.pos[1] },
            rot: Vector.create(),
            speed: Vector.create()
        });
        const weapon = SceneWeaponInfo.create({
            entityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_WEAPON, FAKE_WEAPON_ID),
            gadgetId: 50011406, // TODO
            itemId: 11406,
            guid: BigInt(IdManager.getGuidByUidId(userId, FAKE_WEAPON_ID).toString()),
            level: 70,
            promoteLevel: 4,
            abilityInfo: AbilitySyncStateInfo.create(),
            affixMap: { 111406: 0 }
        });
        const sceneAvatarInfo = SceneAvatarInfo.create({
            uid: userId,
            avatarId: avatarInfo.avatarId,
            guid: BigInt(avatar.avatar.toString()),
            peerId: 1, // TODO
            skillDepotId: avatarInfo.skillDepotId,
            bornTime: avatarInfo.bornTime,
            talentIdList: avatarInfo.talentIdList,
            inherentProudSkillList: avatarInfo.inherentProudSkillList,
            skillLevelMap: avatarInfo.skillLevelMap,
            proudSkillExtraLevelMap: avatarInfo.proudSkillExtraLevelMap,
            equipIdList: [11406], // TODO
            weapon,
            wearingFlycloakId: 140001 // TODO
        });
        const sceneAiInfo = SceneEntityAiInfo.create({ isAiOpen: true, bornPos: Vector.create() });
        const authorityInfo = EntityAuthorityInfo.create({ aiInfo: sceneAiInfo });

        return SceneEntityInfo.create({
            entityType: ProtEntityType.PROT_ENTITY_AVATAR,
            entityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_AVATAR, FAKE_AVATAR_ID),
            lifeState: 1,
            entity: { oneofKind: "avatar", avatar: sceneAvatarInfo },
            propList: propTypeMapToPair(avatarProps), // TODO
            fightPropList: fightPropMapToPair(fightProps),
            motionInfo,
            entityAuthorityInfo: authorityInfo,
            animatorParaList: [AnimatorParameterValueInfoPair.create({
                nameId: 0, // TODO
                animatorPara: AnimatorParameterValueInfo.create()
            })]
        });
    }

    reg.register("PingReq", "PingRsp", async (_, __, req) => PingRsp.create({
        clientTime: req.clientTime
    }));

    reg.register("SceneInitFinishReq", "SceneInitFinishRsp", async (userId, metadata) => {
        const avGuid = await db.getPlayerTeamSelection(userId).then(unwrap);
        const sceneInfo = await db.getPlayerSceneInfo(userId).then(unwrap);
        const user = await db.getPlayerInfo(userId).then(unwrap);
        const props = await db.getPlayerProps(userId).then(unwrap);

        const userLevel = props[PropType.PROP_PLAYER_LEVEL];
        const worldLevel = props[PropType.PROP_PLAYER_LEVEL_LOCK_ID];

        reg.notifyPacket("WorldDataNotify", userId, metadata, {
            worldPropMap: {
                1: PropValue.create({
                    type: 1,
                    val: BigInt(8),
                    value: { oneofKind: "ival", ival: BigInt(8) }
                }),
                2: PropValue.create({
                    type: 2,
                    val: BigInt(0),
                    value: { oneofKind: "ival", ival: BigInt(0) }
                })
            } 
        });

        const onlinePlayerInfo = OnlinePlayerInfo.create({
            uid: userId,
            nickname: user.nickName,
            playerLevel: userLevel,
            avatarId: user.avatarId,
            mpSettingType: MpSettingType.MP_SETTING_ENTER_AFTER_APPLY,
            curPlayerNumInWorld: 1, // TODO
            worldLevel,
            nameCardId: user.namecardId,
            signature: user.signature
        });

        reg.notifyPacket("WorldPlayerInfoNotify", userId, metadata, {
            playerInfoList: [onlinePlayerInfo],
            playerUidList: [userId]
        });

        const scenePlayerInfo = ScenePlayerInfo.create({
            uid: userId,
            peerId: 1, // TODO
            name: user.nickName,
            sceneId: sceneInfo.sceneId,
            onlinePlayerInfo: onlinePlayerInfo
        });

        reg.notifyPacket("ScenePlayerInfoNotify", userId, metadata, {
            playerInfoList: [scenePlayerInfo]
        });

        const avatarEnterInfo = AvatarEnterSceneInfo.create({
            avatarGuid: BigInt(avGuid.avatar.toString()),
            avatarEntityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_AVATAR, FAKE_AVATAR_ID),
            avatarAbilityInfo: AbilitySyncStateInfo.create(),
            weaponGuid: BigInt(IdManager.getGuidByUidId(userId, FAKE_WEAPON_ID).toString()),
            weaponEntityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_WEAPON, FAKE_WEAPON_ID),
            weaponAbilityInfo: AbilitySyncStateInfo.create()
        });
        const mpLevelInfo = MPLevelEntityInfo.create({
            entityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_MP_LEVEL, FAKE_MP_LEVEL_ID),
            authorityPeerId: 1,
            abilityInfo: AbilitySyncStateInfo.create()
        });
        const teamEnterInfo = TeamEnterSceneInfo.create({
            teamEntityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_TEAM, FAKE_TEAM_ID),
            teamAbilityInfo: AbilitySyncStateInfo.create()
        });

        reg.notifyPacket("PlayerEnterSceneInfoNotify", userId, metadata, {
            enterSceneToken: sceneInfo.sceneToken,
            avatarEnterInfo: [avatarEnterInfo],
            curAvatarEntityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_AVATAR, FAKE_AVATAR_ID),
            mpLevelEntityInfo: mpLevelInfo,
            teamEnterInfo
        });

        reg.notifyPacket("PlayerGameTimeNotify", userId, metadata, {
            gameTime: 5*60*60,
            uid: userId
        });

        reg.notifyPacket("SceneTimeNotify", userId, metadata, {
            sceneId: sceneInfo.sceneId,
            sceneTime: BigInt(9000)
        });

        reg.notifyPacket("SceneDataNotify", userId, metadata, {
            levelConfigNameList: ["Level_BigWorld"]
        });

        reg.notifyPacket("HostPlayerNotify", userId, metadata, {
            hostUid: userId,
            hostPeerId: 1 // TODO
        });

        const sceneTeamAvatar = SceneTeamAvatar.create({
            sceneId: sceneInfo.sceneId,
            playerUid: userId,
            avatarGuid: BigInt(avGuid.avatar.toString()),
            entityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_AVATAR, FAKE_AVATAR_ID),
            weaponGuid: BigInt(IdManager.getGuidByUidId(userId, FAKE_WEAPON_ID).toString()),
            weaponEntityId: IdManager.getEntityIdByTypeSub(ProtEntityType.PROT_ENTITY_WEAPON, FAKE_WEAPON_ID),
            isPlayerCurAvatar: true, // TODO
            sceneEntityInfo: await fakeSceneDefaultAvatar(userId), // TODO
            abilityControlBlock: FAKE_DEFAULT_ABILITIES // TODO
        });

        reg.notifyPacket("SceneTeamUpdateNotify", userId, metadata, {
            sceneTeamAvatarList: [sceneTeamAvatar]
        });

        return SceneInitFinishRsp.create({
            enterSceneToken: sceneInfo.sceneToken
        });
    });

    reg.register("EnterSceneReadyReq", "EnterSceneReadyRsp", async (userId, metadata, req) => {
        const sceneInfo = await db.getPlayerSceneInfo(userId).then(unwrap);

        reg.notifyPacket("EnterScenePeerNotify", userId, metadata, {
            destSceneId: sceneInfo.sceneId,
            peerId: 1, // TODO
            hostPeerId: 1, // TODO
            enterSceneToken: req.enterSceneToken
        });

        return EnterSceneReadyRsp.create({
            enterSceneToken: req.enterSceneToken
        });
    });

    reg.register("EnterSceneDoneReq", "EnterSceneDoneRsp", async (userId, metadata, req) => {
        reg.notifyPacket("SceneEntityAppearNotify", userId, metadata, {
            entityList: [await fakeSceneDefaultAvatar(userId)],
            appearType: VisionType.VISION_BORN // TODO
        });

        return EnterSceneDoneRsp.create({
            enterSceneToken: req.enterSceneToken
        });
    });

    reg.register("PostEnterSceneReq", "PostEnterSceneRsp", async (userId) => {
        const sceneInfo = await db.getPlayerSceneInfo(userId).then(unwrap);
        return PostEnterSceneRsp.create({
            enterSceneToken: sceneInfo.sceneToken
        });
    });

    reg.register("EnterWorldAreaReq", "EnterWorldAreaRsp", async (_, __, req) => EnterWorldAreaRsp.create({
        areaId: req.areaId,
        areaType: req.areaType
    }));
}
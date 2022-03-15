import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { GameDb } from "@ysparadox/game-db";
import { AvatarTeam, PlayerLoginRsp, PropType, StoreType } from "@ysparadox/ysproto";
import { buildAvatarInfo, propTypeRemap, unwrap } from "@ysparadox/proto-utils";

export function registerLoginManager(reg: PacketHandlerRegistry, db: GameDb){
    async function getTeamInfo(userId: number): Promise<Record<number, AvatarTeam>> {
        const teams = await db.getPlayerTeams(userId).then(unwrap);
        const playerTeamAvatars = await db.getPlayerTeamsAvatars(userId).then(unwrap);
        const teamIdToGuid: Record<number, bigint[]> = {};

        for (const avatar of playerTeamAvatars) {
            const arr = teamIdToGuid[avatar.teamId];
            const guid = BigInt(avatar.guid.toString());
            if (arr) {
                arr.push(guid);
            } else {
                teamIdToGuid[avatar.teamId] = [guid];
            }
        }

        return Object.fromEntries(teams.map((team) => [team.id, AvatarTeam.create({
            teamName: team.name,
            avatarGuidList: teamIdToGuid[team.id]
        })]));
        
    }

    reg.register("PlayerLoginReq", "PlayerLoginRsp", async (userId, metadata) => {
        const user = await db.getPlayerInfo(userId).then(unwrap);

        const playerP = await db.getPlayerProps(userId).then(unwrap);
        const playerProps = propTypeRemap(playerP);

        const openState = await db.getOpenState(userId).then(unwrap) as Record<number, number>;
        const inventory = await db.getInventory(userId).then(unwrap);
        const avatarList = await db.getAvatars(userId).then(unwrap);
        
        const teamMap = await getTeamInfo(userId);
        const teamSel = await db.getPlayerTeamSelection(userId).then(unwrap);

        const sceneInfo = await db.getPlayerSceneInfo(userId).then(unwrap);
        const worldLevel = playerP[PropType.PROP_PLAYER_LEVEL_LOCK_ID];
    
        reg.notifyPacket("PlayerDataNotify", userId, metadata, {
            nickName: user.nickName,
            serverTime: BigInt(Date.now()),
            propMap: playerProps
        });
        reg.notifyPacket("OpenStateUpdateNotify", userId, metadata, {
            openStateMap: openState
        });

        reg.notifyPacket("StoreWeightLimitNotify", userId, metadata, {
            storeType: StoreType.STORE_PACK,
            weightLimit: 30000,
            materialCountLimit: 2000,
            weaponCountLimit: 2000,
            reliquaryCountLimit: 1000,
            furnitureCountLimit: 2000
        });

        reg.notifyPacket("PlayerStoreNotify", userId, metadata, {
            storeType: StoreType.STORE_PACK,
            weightLimit: 30000,
            itemList: inventory
        });

        reg.notifyPacket("AvatarDataNotify", userId, metadata, {
            avatarList: await Promise.all(avatarList.map((a) => buildAvatarInfo(db, a))),
            avatarTeamMap: teamMap,
            curAvatarTeamId: teamSel.team,
            chooseAvatarGuid: BigInt(teamSel.avatar.toString()),
            ownedFlycloakList: [140001]
        });

        reg.notifyPacket("PlayerEnterSceneNotify", userId, metadata, {
            sceneId: sceneInfo.sceneId,
            type: 4,
            sceneBeginTime: BigInt(Date.now()),
            pos: { x: sceneInfo.pos[0], y: sceneInfo.pos[1], z: sceneInfo.pos[2] },
            targetUid: userId,
            worldLevel: worldLevel,
            enterSceneToken: sceneInfo.sceneToken
        });

        return PlayerLoginRsp.create();
    })
}
import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { GameDb } from "@ysparadox/game-db";
import { AvatarTeam, PlayerLoginRsp, PropType, PropValue } from "@ysparadox/ysproto";
import { isNone, Option } from "fp-ts/lib/Option";

function unwrap<T>(o: Option<T>): T {
    if (isNone(o)) throw Error("failed to unwrap option");
    return o.value;
}

function playerPropRemap(props: Partial<Record<PropType, number>>) {
    const ents = Object.entries(props);
    return Object.fromEntries(ents.flatMap(([propT, propV]) => {
        if (!propV) return [];

        const v = PropValue.create({
            type: parseInt(propT),
            val: BigInt(propV),
            value: { oneofKind: "ival", ival: BigInt(propV) }
        });

        return [[propT, v]];
    })) as Partial<Record<PropType, PropValue>>;
}

export function registerLoginManager(reg: PacketHandlerRegistry, db: GameDb){
    async function getTeamInfo(userId: number): Promise<Record<number, AvatarTeam>> {
        const teams = unwrap(await db.getPlayerTeams(userId));
        const playerTeamAvatars = unwrap(await db.getPlayerTeamsAvatars(userId));
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

    reg.register("PlayerLoginReq", "PlayerLoginRsp", async (userId, metadata, req) => {
        const user = unwrap(await db.getPlayerInfo(userId));

        const playerP = unwrap(await db.getPlayerProps(userId));
        const playerProps = playerPropRemap(playerP);

        const openState = unwrap(await db.getOpenState(userId));
        const inventory = unwrap(await db.getInventory(userId));
        const avatarList = unwrap(await db.getAvatars(userId));
        
        const teamMap = await getTeamInfo(userId);
        const teamSel = unwrap(await db.getPlayerTeamSelection(userId));

        const sceneInfo = unwrap(await db.getPlayerSceneInfo(userId))
        const worldLevel = playerProps[PropType.PROP_PLAYER_LEVEL_LOCK_ID]?.val;

        // TODO: send notify
        return PlayerLoginRsp.create();
    })
}
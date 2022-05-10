import { FAKE_AVATAR_ID, GameDb } from "@ysparadox/game-db";
import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { unwrap } from "@ysparadox/proto-utils";
import { FriendOnlineState, GetPlayerBlacklistRsp, GetPlayerFriendListRsp, GetPlayerSocialDetailRsp, PropType, SocialDetail } from "@ysparadox/ysproto";
import { SocialShowAvatarInfo } from "@ysparadox/ysproto";
import util from "util";

export function registerSocialSubsys(reg: PacketHandlerRegistry, db: GameDb) {
    // TODO
    reg.register("GetPlayerBlacklistReq", "GetPlayerBlacklistRsp", async () => GetPlayerBlacklistRsp.create());
    // TODO
    reg.register("GetPlayerFriendListReq", "GetPlayerFriendListRsp", async () => GetPlayerFriendListRsp.create());

    reg.register("GetPlayerSocialDetailReq", "GetPlayerSocialDetailRsp", async (userId) => {
        const user = await db.getPlayerInfo(userId).then(unwrap);

        const props = await db.getPlayerProps(userId).then(unwrap);

        const userLevel = props[PropType.PROP_PLAYER_LEVEL];
        const worldLevel = props[PropType.PROP_PLAYER_LEVEL_LOCK_ID];

        const avatarInfo = SocialShowAvatarInfo.create({ avatarId: user.avatarId, level: 80 });

        const details = SocialDetail.create({
            uid: userId,
            nickname: user.nickName,
            level: userLevel,
            signature: user.signature,
            birthday: { month: user.birthday.getMonth()+1, day: user.birthday.getDate() },
            worldLevel,
            onlineState: FriendOnlineState.FRIEND_ONLINE,
            isFriend: true, // lie
            isMpModeAvailable: true, // lie
            nameCardId: user.namecardId,
            finishAchievementNum: user.finishAchievementNum,
            towerFloorIndex: user.towerFloorIndex,
            towerLevelIndex: user.towerLevelIndex,
            showAvatarInfoList: [avatarInfo],
            showNameCardIdList: [user.namecardId],
            profilePicture: { avatarId: 10000007 }
        });


        console.log(util.inspect(GetPlayerSocialDetailRsp.create({ detailData: details }), false, 6))

        return GetPlayerSocialDetailRsp.create({ detailData: details });
    })
}

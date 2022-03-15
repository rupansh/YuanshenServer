import { PacketHandlerRegistry } from "@ysparadox/packet-handler"
import { GetPlayerTokenRsp } from "@ysparadox/ysproto"
import { fromNullable } from "fp-ts/lib/Option";

const PLAYER_TOKEN_SEED = 0x123456789ABCDEF0n; // TODO use proper value
export const SPOOF_UID = 1337; // TODO

export type AuthManager = ReturnType<typeof authManager>;

export function authManager(registry: PacketHandlerRegistry) {
    const convToUser: { [idx: number]: number } = {};
    const userToConv: { [idex: number]: number } = {};

    registry.register("GetPlayerTokenReq", "GetPlayerTokenRsp", (conv, _, req) => {
        const uid = SPOOF_UID;

        const rsp = GetPlayerTokenRsp.create({
            accountType: req.accountType,
            accountUid: req.accountUid,
            token: `token-game-${req.accountUid}`,
            secretKeySeed: PLAYER_TOKEN_SEED,
            uid
        });

        convToUser[conv] = uid;
        userToConv[uid] = conv;

        return Promise.resolve(rsp);
    })

    return {
        resolveUid: (conv: number) => fromNullable(convToUser[conv]),
        resolveConv: (uid: number) => fromNullable(userToConv[uid])
    } as const;
}

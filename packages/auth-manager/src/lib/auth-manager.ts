import { PacketHandler } from "@ysparadox/packet-handler"
import { GetPlayerTokenRsp } from "@ysparadox/ysproto"
import { fromNullable } from "fp-ts/lib/Option";

const PLAYER_TOKEN_SEED = 0x123456789ABCDEF0n; // TODO use proper value
const SPOOF_UID = 1337; // TODO

const PACKET_REQ = "GetPlayerTokenReq";
const PACKET_RSP = "GetPlayerTokenRsp";

export function authManager() {
    const convToUser: { [idx: number]: number } = {};
    const userToConv: { [idex: number]: number } = {};

    const protoHandler: PacketHandler<typeof PACKET_REQ, typeof PACKET_RSP> = (conv, _, req) => {
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
    }

    return {
        protoReq: PACKET_REQ,
        protoRes: PACKET_RSP,
        protoHandler,
        resolveUid: (conv: number) => fromNullable(convToUser[conv]),
        resolveConv: (uid: number) => fromNullable(userToConv[uid])
    };
}

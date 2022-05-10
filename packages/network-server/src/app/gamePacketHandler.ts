import { AuthManager } from "@ysparadox/auth-manager";
import { PacketHandlerRepo } from "@ysparadox/packet-handler";
import { DataPacket } from "@ysparadox/proto-utils";
import { PacketHead, UnionCmdNotify } from "@ysparadox/ysproto";
import { isNone } from "fp-ts/lib/Option";
import { PLAYER_TOKEN_REQ_ID, UNION_CMD_NOTI_ID } from "./consts";

export function gamePacketHandler(am: AuthManager, packetHandler: PacketHandlerRepo) {
    const unionPacketHandler = async (userId: number, metadata: Buffer, data: Buffer) => {
        const unPk = UnionCmdNotify.fromBinary(data);
        for (const ucmd of unPk.cmdList) {
            await packetHandler.handlePacket(ucmd.messageId.toString() as never, userId, metadata, data);
        }
    }

    const processGamePacket = async (conv: number, packet: Buffer) => {
        const data = DataPacket.newFromBytes(packet);
        if (isNone(data)) return console.error("malformed game packet, ignoring");

        const metadata = DataPacket.metadata(data.value);

        try {
            PacketHead.fromBinary(metadata);
        } catch (e) {
            console.log("malformed packet header", e, "header:", metadata);
        }

        const dataData = DataPacket.data(data.value);
        const packetId = DataPacket.packetId(data.value);
        if (packetId.toString() == PLAYER_TOKEN_REQ_ID) return packetHandler.handlePacket(PLAYER_TOKEN_REQ_ID, conv, metadata, dataData)

        const userId = am.resolveUid(conv);
        if (isNone(userId)) return console.error("gamePacketHandler: unknown conv", conv, "ignoring");

        if (packetId.toString() == UNION_CMD_NOTI_ID) return await unionPacketHandler(userId.value, metadata, dataData);

        await packetHandler.handlePacket(packetId.toString() as never, userId.value, metadata, dataData);
    }

    return {
        processGamePacket
    }
}
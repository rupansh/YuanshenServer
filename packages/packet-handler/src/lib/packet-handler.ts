import * as proto from "@ysparadox/ysproto";
import { PacketHead } from "@ysparadox/ysproto";
import { ProtoNameFromPacket, SupportedPacketId, DeriveProto, SupportedProtoName, SupportedRsp, PacketFromProto } from "./type-utils";

export type PacketHandler<Rq extends SupportedProtoName, Rs extends SupportedRsp> = {
    (userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>): Promise<DeriveProto<Rs>>
}

type PacketIdHandlers = {
    get<K extends SupportedPacketId, R extends SupportedRsp>(k: K): [PacketHandler<ProtoNameFromPacket<K>, R>, R] | undefined;
    set<K extends SupportedPacketId, R extends SupportedRsp>(k: K, p: [PacketHandler<ProtoNameFromPacket<K>, R>, R]): void;
};

type PacketHandlerHelper = ReturnType<typeof packetHandlerHelper>;

export type PacketHandlerRegistry = Pick<PacketHandlerHelper, "register">;
export type PacketHandlerRepo = Pick<PacketHandlerHelper, "handlePacket">;
export type PacketSender = (userId: number, rspId: number, metadata: Buffer, rsp: Buffer) => void;

export function packetHandlerHelper(sender: PacketSender) {
    const handlers: PacketIdHandlers = new Map(); 

    return {
        register<Rq extends SupportedProtoName, Rs extends SupportedRsp>(
            protoReq: Rq,
            protoRes: Rs,
            // ProtoNameFromPacket<PacketFromProto<Rq>> is same as Rq
            handler: PacketHandler<ProtoNameFromPacket<PacketFromProto<Rq>>, Rs>,
        ) {
            const packetId = proto.reversePacketIds[protoReq];
            handlers.set(packetId, [handler, protoRes])
        },
        async handlePacket<P extends SupportedPacketId>(protoId: P, userId: number, metadata: Buffer, data: Buffer) {
            const res = handlers.get(protoId);
            if (!res) {
                console.warn("unhandled packet", protoId, "ignoring");
                return;
            }
            const protoName = proto.packetIds[protoId];
            const reqProto = proto[protoName];

            const req = reqProto.fromBinary(data) as DeriveProto<ProtoNameFromPacket<P>>;

            const rsp = await res[0](userId, PacketHead.fromBinary(metadata), req);
            const rspId = proto[`${res[1]}_CmdId`].CMD_ID;
            const rspRaw = proto[`${res[1]}`].toBinary(rsp as never);

            sender(userId, rspId, metadata, Buffer.from(rspRaw));
        } 
    }
}
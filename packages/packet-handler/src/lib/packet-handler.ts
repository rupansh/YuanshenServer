import * as proto from "@ysparadox/ysproto";
import { PacketHead } from "@ysparadox/ysproto";
import { ProtoNameFromPacket, SupportedPacketId, DeriveProto, SupportedProtoName, Identity, SupportedRsp } from "./type-utils";

export type PacketHandler<Rq extends SupportedProtoName, Rs extends SupportedRsp> = {
    (userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>): Promise<DeriveProto<Rs>>
}

export type PacketHandlerSvc<Rq extends SupportedProtoName, Rs extends SupportedRsp> = {
    protoReq: Rq,
    protoRes: Rs,
    protoHandler: (userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>) => Promise<DeriveProto<Rs>>
};

type PacketIdHandlers = {
    get<K extends SupportedPacketId, R extends SupportedRsp>(k: K): PacketHandlerSvc<ProtoNameFromPacket<K>, R> | undefined;
    set<K extends SupportedPacketId, R extends SupportedRsp>(k: K, p: PacketHandlerSvc<ProtoNameFromPacket<K>, R>): void;
};

type PacketHandlerHelper = ReturnType<typeof packetHandlerHelper>;

export type PacketHandlerRegistry = Pick<PacketHandlerHelper, "register">;
export type PacketHandlerRepo = Pick<PacketHandlerHelper, "handlePacket">;
export type PacketSender = (userId: number, rspId: number, metadata: Buffer, rsp: Buffer) => void;

export function packetHandlerHelper(sender: PacketSender) {
    const handlers: PacketIdHandlers = new Map(); 

    return {
        register<Rq extends SupportedProtoName & Identity<SupportedProtoName>, Rs extends SupportedRsp>(
            handler: PacketHandlerSvc<Rq, Rs>,
        ) {
            const packetId = proto.reversePacketIds[handler.protoReq];
            handlers.set(packetId, handler)
        },
        async handlePacket<P extends SupportedPacketId>(protoId: P, userId: number, metadata: proto.PacketHead, data: Buffer) {
            const res = handlers.get(protoId);
            if (!res) {
                console.warn("unhandled packet", protoId, "ignoring");
                return;
            }
            const protoName = proto.packetIds[protoId];
            const reqProto = proto[protoName];

            const req = reqProto.fromBinary(data) as DeriveProto<ProtoNameFromPacket<P>>;

            const rsp = await res.protoHandler(userId, metadata, req);
            const rspId = proto[`${res.protoRes}_CmdId`].CMD_ID;
            const rspRaw = proto[`${res.protoRes}`].toBinary(rsp as never);

            sender(userId, rspId, Buffer.from(PacketHead.toBinary(metadata)), Buffer.from(rspRaw));
        } 
    }
}
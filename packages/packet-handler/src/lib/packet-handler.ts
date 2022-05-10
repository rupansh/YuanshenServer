import * as proto from "@ysparadox/ysproto";
import { PacketHead } from "@ysparadox/ysproto";
import { ProtoNameFromPacket, SupportedPacketId, DeriveProto, SupportedReq, SupportedNotify, SupportedRsp, Identity } from "./type-utils";

export type PacketHandler<Rq extends SupportedReq, Rs extends SupportedRsp> = {
    (userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>): Promise<DeriveProto<Rs>>
}

export type NotifyHandler<Rq extends SupportedNotify> = {
    (userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>): void
}

type PacketIdHandlers = {
    get<K extends SupportedPacketId, R extends SupportedRsp>(k: K): [PacketHandler<ProtoNameFromPacket<K> & SupportedReq, R>, R] | undefined;
    set<K extends SupportedPacketId, R extends SupportedRsp>(k: K, p: [PacketHandler<ProtoNameFromPacket<K> & SupportedReq, R>, R]): void;
};

type PacketNotifyHandlers = {
    get<K extends SupportedPacketId>(k: K): NotifyHandler<ProtoNameFromPacket<K> & SupportedNotify> | undefined;
    set<K extends SupportedPacketId>(k: K, n: NotifyHandler<ProtoNameFromPacket<K> & SupportedNotify>): void;
}

export type PacketHandlerHelper = ReturnType<typeof packetHandlerHelper>;

export type PacketHandlerRegistry = Pick<ReturnType<typeof packetHandlerHelper>, "register" | "registerNotify" | "notifyPacket">;
export type PacketHandlerRepo = Pick<PacketHandlerHelper, "handlePacket">;
export type PacketSender = (userId: number, rspId: number, metadata: Buffer, rsp: Buffer) => void;

export function packetHandlerHelper(sender: PacketSender) {
    const handlers: PacketIdHandlers = new Map();
    const notiHandlers: PacketNotifyHandlers = new Map();

    function protoDecoder<P extends SupportedPacketId, T>(protoId: P, data: Buffer): DeriveProto<ProtoNameFromPacket<P> & T> {
        const protoName = proto.packetIds[protoId];
        console.log("proto name is", protoName);
        const reqProto = proto[protoName];

        return reqProto.fromBinary(data) as DeriveProto<ProtoNameFromPacket<P> & T>;
    }

    function notifyHandler<P extends SupportedPacketId>(protoId: P, userId: number, metadata: Buffer, data: Buffer) {
        const res = notiHandlers.get(protoId);
        if (!res) return console.warn("unhandled packet", protoId, "ignoring");
        const req = protoDecoder<P, SupportedNotify>(protoId, data);
        return res(userId, PacketHead.fromBinary(metadata), req);
    }

    return {
        register<Rq extends SupportedReq, Rs extends SupportedRsp>(
            protoReq: Rq,
            protoRes: Rs,
            handler: PacketHandler<Rq & Identity<Rq>, Rs>,
        ) {
            const packetId = proto.reversePacketIds[protoReq];
            handlers.set(packetId, [handler, protoRes])
        },
        registerNotify<Rq extends SupportedNotify>(protoNotify: Rq, handler: NotifyHandler<Rq & Identity<Rq>>) {
            const packetId = proto.reversePacketIds[protoNotify];
            notiHandlers.set(packetId, handler);
        },
        async handlePacket<P extends SupportedPacketId>(protoId: P, userId: number, metadata: Buffer, data: Buffer) {
            const res = handlers.get(protoId);
            if (!res) return notifyHandler(protoId, userId, metadata, data); 

            const req = protoDecoder<P, SupportedReq>(protoId, data);
            const rsp = await res[0](userId, PacketHead.fromBinary(metadata), req);
            const rspId = proto[`${res[1]}_CmdId`].CMD_ID;
            const rspRaw = proto[`${res[1]}`].toBinary(rsp as never);

            console.log(
                "proto:",
                res[1],
                "sending packet",
            )

            sender(userId, rspId, metadata, Buffer.from(rspRaw));
        },
        notifyPacket<P extends SupportedNotify>(protoN: P, userId: number, metadata: proto.PacketHead, data: Partial<DeriveProto<P>>) {
            const reqProto = proto[protoN];
            const packetId = parseInt(proto.reversePacketIds[protoN]);
            const fullProto = reqProto.create(data) as DeriveProto<P>;
            const protoRaw = Buffer.from(reqProto.toBinary(fullProto as never));
            console.log("Notifying", protoN);
            sender(userId, packetId, Buffer.from(PacketHead.toBinary(metadata)), protoRaw);
        } 
    }
}
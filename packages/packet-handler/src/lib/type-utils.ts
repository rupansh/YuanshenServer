import { MessageType } from "@protobuf-ts/runtime";
import * as protos from "@ysparadox/ysproto";

type PacketIdValueG<T extends PacketId> = (typeof protos.packetIds)[T];

type PacketId = keyof typeof protos.packetIds;
type PacketIdValue = PacketIdValueG<PacketId>;

type ProtoKeys = keyof typeof protos;
export type SupportedProtoName = ProtoKeys & PacketIdValue;
type ExMessageType<T extends MessageType<object>> = T extends MessageType<infer V> ? V : never;
export type DeriveProto<T extends SupportedProtoName> = ExMessageType<(typeof protos[T])>;
export type SupportedProto = DeriveProto<SupportedProtoName>;

type RspCmdIds = SupportedProto & {
    [K in SupportedProtoName]: typeof protos[`${K}_CmdId`]
};
export type SupportedRsp = (keyof RspCmdIds) & SupportedProtoName;

export type SupportedPacketId = {
    [K in PacketId]: PacketIdValueG<K> extends SupportedProtoName ? K : never
}[PacketId];

export type PacketFromProto<T extends SupportedProtoName> = typeof protos.reversePacketIds[T] & SupportedPacketId;
export type ProtoNameFromPacket<T extends SupportedPacketId> = PacketIdValueG<T> & SupportedProtoName;

export type Identity<T extends SupportedProtoName> = T extends ProtoNameFromPacket<PacketFromProto<T>> ? ProtoNameFromPacket<PacketFromProto<T>> : never;
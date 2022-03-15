import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { PlayerSetPauseRsp } from "@ysparadox/ysproto";

export function registerPauseSubsys(reg: PacketHandlerRegistry) {
    // Stub
    reg.register("PlayerSetPauseReq", "PlayerSetPauseRsp", async () => PlayerSetPauseRsp.create())
}
import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { NpcTalkRsp } from "@ysparadox/ysproto";

export function registerNpcSubsys(reg: PacketHandlerRegistry) {
    reg.register("NpcTalkReq", "NpcTalkRsp", async (_, __, req) => {
        return NpcTalkRsp.create({
            curTalkId: req.talkId,
            entityId: req.entityId
        });
    })
}
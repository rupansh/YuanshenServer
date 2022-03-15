import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { GetSceneAreaRsp, GetScenePointRsp } from "@ysparadox/ysproto";

export function registerSceneSubsys(reg: PacketHandlerRegistry) {
    reg.register("GetSceneAreaReq", "GetSceneAreaRsp", async (_, __, req) => GetSceneAreaRsp.create({
        sceneId: req.sceneId,
        areaIdList: Array.from({ length: 19 }, (_, i) => i+1 ),
        cityInfoList: [
            { cityId: 1, level: 10 },
            { cityId: 2, level: 10 },
            { cityId: 3, level: 10 }
        ]
    }));

    reg.register("GetScenePointReq", "GetScenePointRsp", async (_, __, req) => GetScenePointRsp.create({
        sceneId: req.sceneId,
        unlockedPointList: Array.from({ length: 249 }, (_, i) => i+1),
        unlockAreaList: Array.from({ length: 10 }, (_, i) => i+1)
    }))
}
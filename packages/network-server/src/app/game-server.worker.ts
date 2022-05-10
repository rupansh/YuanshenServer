import { GameDb, mockGameDb } from "@ysparadox/game-db";
import { PacketHandlerRegistry, workerPacketRegistry } from "@ysparadox/packet-handler";
import { registerGameWorld, registerLoginManager, registerNpcSubsys, registerPauseSubsys, registerSceneSubsys, registerShopSubSys, registerSocialSubsys } from "@ysparadox/subsystems";
import { MessagePort, workerData } from "worker_threads";

export function gameServer(reg: PacketHandlerRegistry, db: GameDb) {
    // TODO: entity subsystem
    registerLoginManager(reg, db);
    registerNpcSubsys(reg);
    registerShopSubSys(reg, db);
    registerSceneSubsys(reg);
    registerPauseSubsys(reg);
    registerSocialSubsys(reg, db);

    // TODO: seperate game world for each user
    registerGameWorld(reg, db);
}

type WorkerData = {
    port: MessagePort
};

const data: WorkerData = workerData;
const reg = workerPacketRegistry(data.port);
const db = mockGameDb();

gameServer(reg, db);
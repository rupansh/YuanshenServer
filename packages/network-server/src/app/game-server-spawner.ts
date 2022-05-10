import { PacketHandlerRegistry, wrapGameWorker } from "@ysparadox/packet-handler";
import path from "path";
import { MessageChannel, Worker } from "worker_threads";

export function spawnGameServer(reg: PacketHandlerRegistry) {
    const { port1, port2 } = new MessageChannel();
    const worker = new Worker(path.join(__dirname, "/worker.js"), { workerData: { port: port1 }, transferList: [port1] });
    wrapGameWorker(
        port2,
        worker,
        reg
    );
}
import { MessagePort, parentPort } from "worker_threads";
import { PacketHandler, PacketHandlerHelper, PacketHandlerRegistry } from "./packet-handler";
import { DeriveProto, SupportedProtoName, SupportedRsp } from "./type-utils";
import * as proto from "@ysparadox/ysproto";
import { ClientProxy } from "delight-rpc";
import { createServer } from "@delight-rpc/worker-threads";

type WorkerPacketHandler = {
    handlePacket: <Rq extends SupportedProtoName>(
        protoName: Rq, userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>
    ) => Promise<DeriveProto<SupportedRsp>>
};

type PacketNameHandlers = {
    get<K extends SupportedProtoName>(k: K): PacketHandler<K, SupportedRsp>;
    set<K extends SupportedProtoName>(k: K, p: PacketHandler<K, SupportedRsp>): void;
}

type RegisterMsg = {
    req: SupportedProtoName,
    res: SupportedRsp
};

export function wrapGameWorker(
    registerListener: MessagePort,
    rpcClient: ClientProxy<WorkerPacketHandler>,
    inner: PacketHandlerHelper
) {
    registerListener.on("message", (msg: RegisterMsg) => {
        inner.register(
            msg.req,
            msg.res,
            (userId, metadata, proto) => rpcClient.handlePacket(
                msg.req,
                userId,
                metadata,
                proto
            )
        );
    });
}

export function workerPacketRegistry(registerSender: MessagePort): PacketHandlerRegistry {
    const handlers: PacketNameHandlers = new Map();

    createServer<WorkerPacketHandler>({
        handlePacket: (req, ...args) => {
            const handler = handlers.get(req);
            if (!handler) {
                throw Error(`received unknown proto req ${req}`);
            }
            return handler(...args);
        }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    }, parentPort!);

    return {
        register(req, res, handler) {
            handlers.set(req, handler);
            const msg: RegisterMsg = { req, res };
            registerSender.postMessage(msg)
        }
    }
}
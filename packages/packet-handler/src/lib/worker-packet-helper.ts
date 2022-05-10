import { MessagePort, parentPort, Worker } from "worker_threads";
import { NotifyHandler, PacketHandler, PacketHandlerRegistry } from "./packet-handler";
import { DeriveProto, SupportedNotify, SupportedReq, SupportedRsp } from "./type-utils";
import * as proto from "@ysparadox/ysproto";
import { createClient, createServer } from "@delight-rpc/worker-threads";

type WorkerPacketHandler = {
    handlePacket: <Rq extends SupportedReq>(
        protoName: Rq, userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>
    ) => Promise<DeriveProto<SupportedRsp>>;
    handleNotify: <Rq extends SupportedNotify>(
        protoName: Rq, userId: number, metadata: proto.PacketHead, req: DeriveProto<Rq>
    ) => void;
};

type PacketNameHandlers = {
    get<K extends SupportedReq>(k: K): PacketHandler<K, SupportedRsp>;
    set<K extends SupportedReq>(k: K, p: PacketHandler<K, SupportedRsp>): void;
}

type PacketNameNotiHandlers = {
    get<K extends SupportedNotify>(k: K): NotifyHandler<K>;
    set<K extends SupportedNotify>(k: K, p: NotifyHandler<K>): void;
}

type RegisterMsg = {
    sub: "register",
    req: SupportedReq,
    res: SupportedRsp
};

type RegisterNotifyMsg = {
    sub: "regNotify",
    req: SupportedNotify
}

type NotifyMsg = {
    sub: "notify",
    name: SupportedNotify,
    userId: number,
    metadata: proto.PacketHead,
    proto: Partial<DeriveProto<NotifyMsg["name"]>>
}

export function wrapGameWorker(
    registryListener: MessagePort,
    gameWorker: Worker,
    inner: PacketHandlerRegistry
) {
    const [rpcClient] = createClient<WorkerPacketHandler>(gameWorker);
    registryListener.on("message", (msg: RegisterMsg | NotifyMsg | RegisterNotifyMsg) => {
        switch (msg.sub) {
            case "register":
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
                break;
            case "notify":
                inner.notifyPacket(
                    msg.name,
                    msg.userId,
                    msg.metadata,
                    msg.proto
                )
                break;
            case "regNotify":
                inner.registerNotify(
                    msg.req,
                    (userId, metadata, proto) => rpcClient.handleNotify(
                        msg.req,
                        userId,
                        metadata,
                        proto
                    )
                )
        }
    });
}

export function workerPacketRegistry(registrySender: MessagePort): PacketHandlerRegistry  {
    const handlers: PacketNameHandlers = new Map();
    const notiHandlers: PacketNameNotiHandlers = new Map();

    createServer<WorkerPacketHandler>({
        handlePacket: (req, ...args) => {
            const handler = handlers.get(req);
            if (!handler) {
                throw Error(`received unknown proto req ${req}`);
            }
            return handler(...args);
        },
        handleNotify: (req, ...args) => {
            const handler = notiHandlers.get(req);
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
            const msg: RegisterMsg = { sub: "register", req, res };
            registrySender.postMessage(msg)
        },
        registerNotify(req, handler) {
            notiHandlers.set(req, handler);
            const msg: RegisterNotifyMsg = { sub: "regNotify", req };
            registrySender.postMessage(msg);
        },
        notifyPacket(name, userId, metadata, data) {
            const msg: NotifyMsg = { sub: "notify", name, userId, metadata, proto: data };
            registrySender.postMessage(msg);
        }
    }
}
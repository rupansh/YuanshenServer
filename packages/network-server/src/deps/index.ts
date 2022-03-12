import { kcpClientConn, KcpContext, kcpUdpSender } from "@ysparadox/kcp-client-conn";
import { loadYsKeys } from "@ysparadox/ys-keys";
import * as dgram from "dgram";

export type Deps = Awaited<ReturnType<typeof createDeps>>;

export async function createDeps() {
    const socket = dgram.createSocket("udp4");
    const sender = kcpUdpSender(socket);
    const keys = await loadYsKeys();

    return {
        socket,
        kcpClientFactory: (ctx: KcpContext, conv: number, token: number) =>
            kcpClientConn(sender, ctx, conv, token, keys.xorKey)
    }
}
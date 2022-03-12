import { authManager } from "@ysparadox/auth-manager";
import { kcpClientConn, KcpContext, kcpUdpSender } from "@ysparadox/kcp-client-conn";
import { loadYsKeys } from "@ysparadox/ys-keys";
import * as dgram from "dgram";
import { Channel } from "@sidewinder/channel";
import { packetHandlerHelper, PacketSender } from "@ysparadox/packet-handler";
import { gamePacketHandler } from "../app/gamePacketHandler";

export type Deps = Awaited<ReturnType<typeof createDeps>>;



function packetRelayChannel(): Channel<Parameters<PacketSender>> {
    return new Channel();
}

export async function createDeps() {
    const socket = dgram.createSocket("udp4");
    const sender = kcpUdpSender(socket);
    const keys = await loadYsKeys();
    const relayChannel = packetRelayChannel();
    const packetHandler = packetHandlerHelper((...args) => relayChannel.send(args));
    const am = authManager(packetHandler);

    return {
        socket,
        kcpClientFactory: (ctx: KcpContext, conv: number, token: number) =>
            kcpClientConn(sender, ctx, conv, token, keys.xorKey),
        authMan: authManager(packetHandler),
        relayChannel,
        packetHandler,
        gamePkHandler: gamePacketHandler(am, packetHandler)
    }
}
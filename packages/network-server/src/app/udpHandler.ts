import * as dgram from "dgram";
import { HandshakePacket } from "@ysparadox/proto-utils";
import { getOrElse, map } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { Deps } from "../deps";
import { KcpClientConn } from "@ysparadox/kcp-client-conn";
import { getConv } from "@ysparadox/kcp";

export function udpHandler(deps: Deps, host: string, port: number) {
    const socket = deps.socket;
    const clients: { [conv: number]: KcpClientConn } = {};

    const handshakeHandler = (rinfo: dgram.RemoteInfo) => {
        // TODO: assign this properly
        const conv = 0x96969696;
        const token = 0x42424242;

        const client = deps.kcpClientFactory(rinfo, conv, token);
        clients[conv] = client;

        const msg = HandshakePacket.newConv(conv, token);
        socket.send(HandshakePacket.toBytes(msg), rinfo.port, rinfo.address);
    }

    const packetHandler = (pkt: Buffer, rinfo: dgram.RemoteInfo) => {
        const conv = getConv(pkt);
        const client = clients[conv];
        if (!client) {
            console.error("unknown client! conv:", conv);
            return;
        }

        client.updateSource(rinfo);
        for (const gamePkt of client.processUdpPacket(pkt)) {
            // TODO
        }
    }

    const messageHandler = (msg: Buffer, rinfo: dgram.RemoteInfo) => {
        const hs = pipe(
            HandshakePacket.newFromRaw(msg),
            map(HandshakePacket.isConnect),
            getOrElse(() => false)
        );
        hs ? handshakeHandler(rinfo) : packetHandler(msg, rinfo);
    }

    return {
        listen() {
            socket.on('listening', () => {
                const addr = socket.address();
                console.log(`network server listening @${addr.port}`);
            });

            socket.on('message', messageHandler)

            socket.bind(port, host);
        }
    }
}
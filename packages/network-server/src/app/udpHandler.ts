import * as dgram from "dgram";
import { DataPacket, HandshakePacket } from "@ysparadox/proto-utils";
import { getOrElse, isNone, map } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { Deps } from "../deps";
import { KcpClientConn } from "@ysparadox/kcp-client-conn";
import { getConv } from "@ysparadox/kcp";
import { GetPlayerTokenRsp } from "@ysparadox/ysproto";
import Long = require("long");
import { PLAYER_TOKEN_RSP_ID } from "./consts";

// TODO: Add Game Server
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
        if (!client) return console.error("unknown client! conv:", conv);

        client.updateSource(rinfo);
        for (const gamePkt of client.processUdpPacket(pkt)) {
            deps.gamePkHandler.processGamePacket(conv, gamePkt);
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

    const updateClientKey = (client: KcpClientConn, rawPacket: Buffer) => {
        // TODO: this decoding is redundant
        const prot = GetPlayerTokenRsp.fromBinary(rawPacket)
        client.updateKey(Long.fromString(prot.secretKeySeed.toString(), true))
    }

    const packetRelayListener = async () => {
        for await (const [userId, packetId, metadata, data] of deps.relayChannel) {
            let conv = 0;
            const isPTR = packetId.toString() == PLAYER_TOKEN_RSP_ID;
            if (isPTR) {
                conv = userId;
            } else if (pipe(
                deps.authMan.resolveConv(userId),
                map((c) => conv = c),
                isNone
            )) {
                console.error("unresolved user id", userId, "ignoring");
                continue;
            }

            const dataPacket = DataPacket.newFrom(packetId, metadata, data);
            const client = clients[conv];
            if (!client) {
                console.error("unknown conv", conv, "ignoring");
                continue;
            }
            client.sendUdpPacket(DataPacket.toBytes(dataPacket));
            isPTR && updateClientKey(client, data);
        }
    }

    return {
        listen() {
            socket.on('listening', () => {
                const addr = socket.address();
                console.log(`network server listening @${addr.port}`);
            });

            socket.on('message', messageHandler)

            socket.bind(port, host);
            packetRelayListener();
        }
    }
}
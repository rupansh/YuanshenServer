import * as dgram from "dgram";
import { HandshakePacket } from "@ysparadox/proto-utils";
import { getOrElse, map } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";

export function networkServer(host: string, port: number) {
    const server = dgram.createSocket("udp4");

    const handshakeHandler = (rinfo: dgram.RemoteInfo) => {
        // TODO: assign this properly
        const conv = 0x96969696;
        const token = 0x42424242;

        const msg = HandshakePacket.newConv(conv, token);
        server.send(HandshakePacket.toBytes(msg), rinfo.port, rinfo.address);
    }

    const messageHandler = (msg: Buffer, rinfo: dgram.RemoteInfo) => {
        const hs = pipe(
            HandshakePacket.newFromRaw(msg),
            map(HandshakePacket.isConnect),
            getOrElse(() => false)
        );
    }

    return {
        listen() {
            server.on('listening', () => {
                const addr = server.address();
                console.log(`network server listening @${addr.port}`);
            });

            server.on('message', messageHandler)

            server.bind(port, host);
        }
    }
}
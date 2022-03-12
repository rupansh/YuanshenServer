import { Kcp, KcpSender } from "@ysparadox/kcp";
import { ysGenKey, ysXor } from "@ysparadox/yscrypt";
import * as dgram from "dgram";
import { none, Option,  isNone, some } from "fp-ts/lib/Option";
import Long = require("long");

export type KcpContext = Parameters<Kcp["switchContext"]>[0];
export type KcpClientConn = ReturnType<typeof kcpClientConn>

export function kcpUdpSender(socket: dgram.Socket): KcpSender {
    return KcpSender.new((data, size, ctx) => socket.send(data, 0, size, ctx.port, ctx.address))
}

const BASE_BUF_SZ = 0x20000;

export function kcpClientConn(sender: KcpSender, ctx: KcpContext, conv: number, token: number, masterKey: Buffer) {
    let curCtx = ctx;
    const kcp = new Kcp(conv, token, sender, curCtx);

    const curKey = masterKey;
    let pendingSeed: Option<Long> = none;

    const startTime = Date.now()

    function processPendingSeed() {
        if (isNone(pendingSeed)) return;
        ysGenKey(curKey, pendingSeed.value, false);
        pendingSeed = none;
    }

    function elapsedMs() {
        return startTime - Date.now();
    }

    function* processUdpPacket(packet: Buffer): Iterable<Buffer> {
        processPendingSeed();

        kcp.input(packet);
        kcp.update(elapsedMs());
        kcp.flush();
        
        let err = false;
        while (!err) {
            const buf = Buffer.alloc(BASE_BUF_SZ);
            try {
                const size = kcp.recv(buf);
                const curP = buf.slice(0, size);
                ysXor(curP, curKey);

                yield curP;
            } catch {
                err = true;
            }
        }
        kcp.update(elapsedMs());
    }

    return {
        updateSource(context: KcpContext) {
            if (curCtx.address == context.address && curCtx.port == context.port) return;
            kcp.switchContext(context);
            curCtx = context;
        },
        processUdpPacket,
        updateKey(seed: Long) {
            pendingSeed = some(seed);
        },
        /**
         * 
         * @param data Buffer to be sent, invalidated after its sent.
         */
        sendUdpPacket(data: Buffer) {
            ysXor(data, curKey);
            kcp.send(data);
            kcp.flush();
            kcp.update(elapsedMs());
        }
    } 
}
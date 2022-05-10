import { ysGenKey, ysXor } from "@ysparadox/yscrypt";
import * as dgram from "dgram";
import { KCP } from "@ysparadox/kcp";
import { none, Option,  isNone, some } from "fp-ts/lib/Option";
import Long from "long";

export type KcpClientConn = ReturnType<typeof kcpClientConn>

export type KcpContext = { address: string, port: number };

export function kcpClientConn(socket: dgram.Socket, ctx: KcpContext, conv: number, token: number, masterKey: Buffer) {
    const senderFunc = (data: Buffer, size: number, ctx: { address: string, port: number }) => {
        socket.send(data, 0, size, ctx.port, ctx.address);
    }

    let curCtx = ctx;
    let kcp = new KCP(conv, token, curCtx);
    kcp.output(senderFunc)

    const curKey = Buffer.alloc(masterKey.length);
    masterKey.copy(curKey);

    let pendingSeed: Option<Long> = none;

    const startTime = Date.now()

    function processPendingSeed() {
        if (isNone(pendingSeed)) return;
        ysGenKey(curKey, pendingSeed.value, false);
        pendingSeed = none;
    }

    function elapsedMs() {
        return Date.now() - startTime;
    }

    function* processUdpPacket(packet: Buffer) {
        processPendingSeed();

        kcp.input(packet);
        kcp.update(elapsedMs());
        kcp.flush();
        
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const buf = kcp.recv()
            if (!buf || buf.length == 0) break;

            ysXor(curKey, buf);

            yield buf
        }
        kcp.update(elapsedMs());
    }

    return {
        updateSource(context: KcpContext) {
            if (curCtx.address == context.address && curCtx.port == context.port) return;
            kcp.release();
            kcp = new KCP(conv, token, context);
            kcp.output(senderFunc);
            curCtx = context;
        },
        processUdpPacket,
        updateKey(seed: Long) {
            pendingSeed = some(seed);
        },
        /**
         * 
         * @param data Buffer to be sent
         */
        sendUdpPacket(data: Buffer) {
            const dataCp = Buffer.alloc(data.length);
            data.copy(dataCp);

            ysXor(curKey, dataCp)
            console.log("sending data", dataCp);
            kcp.send(dataCp);
            kcp.flush();
            kcp.update(elapsedMs());
        }
    } 
}
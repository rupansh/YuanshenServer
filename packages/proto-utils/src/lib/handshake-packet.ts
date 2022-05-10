import { none, Option, some } from "fp-ts/lib/Option";
import { Newtype, iso } from "newtype-ts";

const PACKET_SZ = 20;
const MAGIC_CONN_START = 0x000000FF;
const MAGIC_CONN_END = 0xFFFFFFFF;
const MAGIC_SND_CONV_START = 0x00000145;
const MAGIC_SND_CONV_END = 0x14514545;
const MAGIC_DC_START = 0x00000194;
const MAGIC_DC_END = 0x19419494; 
const CONN_DATA = 1234567890;

/**
 * 0: start_magic BE \
 * 1: param1 BE \
 * 2: param2 BE \
 * 3: data BE \
 * 4: end_magic BE
 */
type Packet = Newtype<{readonly __phantomHandshakePacket: unique symbol }, Buffer> & Record<string, never>;
const isoPacket = iso<Packet>();

const u = (p: Packet) => isoPacket.unwrap(p);
const w = (p: Buffer) => isoPacket.wrap(p);

const startMagic = (p: Packet) => u(p).readUInt32BE(0);
//const param1 = (p: Packet) => u(p).readUInt32BE(4);
//const param2 = (p: Packet) => u(p).readUInt32BE(8);
const data = (p: Packet) => u(p).readUInt32BE(12);
const endMagic = (p: Packet) => u(p).readUInt32BE(16);

export function newFromRaw(raw: Buffer): Option<Packet> {
    if (raw.byteLength != PACKET_SZ) return none;
    const packet = w(raw);

    let endMagicCheck: number;
    switch (startMagic(packet)) {
        case MAGIC_CONN_START:
            endMagicCheck = MAGIC_CONN_END;
            break;
        case MAGIC_SND_CONV_START:
            endMagicCheck = MAGIC_SND_CONV_END;
            break;
        case MAGIC_DC_START:
            endMagicCheck = MAGIC_DC_END;
            break;
        default:
            return none;
    }
    if (endMagic(packet) != endMagicCheck) return none;

    return some(packet);
}

export const isConnect = (p: Packet) => startMagic(p) == MAGIC_CONN_START && data(p) == CONN_DATA; 

export function newConv(conv: number, token: number): Packet {
    // 5 32 bit numbers
    const buf = Buffer.alloc(5 * 4);
    buf.writeUInt32BE(MAGIC_SND_CONV_START, 0);
    buf.writeUInt32BE(conv, 4);
    buf.writeUInt32BE(token, 8);
    buf.writeUInt32BE(CONN_DATA, 12);
    buf.writeUInt32BE(MAGIC_SND_CONV_END, 16);

    return w(buf);
}

export const toBytes = (p: Packet) => u(p)
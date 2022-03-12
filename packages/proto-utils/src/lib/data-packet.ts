import { iso, Newtype } from "newtype-ts";

const DATA_SZ_MIN = 12;
const DATA_MAGIC_START = 0x4567;
const DATA_MAGIC_END = 0x89AB;

/**
 * start_magic: u16 BE
 * packet_id: u16 BE
 * metadata_size: u16 BE
 * data_size: u32 BE
 * metadata: u8 buf
 * data: u8 buf
 * end_magic: u16 BE
 */
type Packet = Newtype<{ readonly __phantomDataPacket: unique symbol }, Buffer>;
const isoPacket = iso<Packet>();

const u = (p: Packet) => isoPacket.unwrap(p);
const w = (p: Buffer) => isoPacket.wrap(p);

/**
 * Does not destroy metadata & data 
 */
export function newFrom(packetId: number, metadata: Buffer, data: Buffer): Packet {
    const ret = Buffer.alloc(DATA_SZ_MIN + data.length + metadata.length);
    let off = ret.writeUInt16BE(DATA_MAGIC_START);
    off = ret.writeUInt16BE(packetId, off);
    off = ret.writeUInt16BE(metadata.length, off);
    off = ret.writeUInt32BE(data.length, off);
    off += metadata.copy(ret, off);
    off += data.copy(ret, off);
    ret.writeUInt16BE(DATA_MAGIC_END, off);

    return w(ret);
}


export const toBytes = u;


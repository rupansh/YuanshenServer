import { none, Option, some } from "fp-ts/lib/Option";
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

const startMagic = (p: Packet) => u(p).readUInt16BE();
export const metadata = (p: Packet) => {
    const sz = metadataSize(p);
    return u(p).slice(10, 10+sz);
}
export const data = (p: Packet) => {
    const msz = metadataSize(p)
    const dsz = dataSize(p);

    return u(p).slice(10+msz, 10+msz+dsz);
}
const metadataSize = (p: Packet) => u(p).readUInt16BE(4);
const dataSize = (p: Packet) => u(p).readUInt32BE(6);
const endMagic = (p: Packet) => {
    const raw = u(p);
    return raw.readUInt16BE(raw.length-2);
}

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

export function newFromBytes(raw: Buffer): Option<Packet> {
    if (raw.length < DATA_SZ_MIN) return none;
    const packet = w(raw);

    if (startMagic(packet) != DATA_MAGIC_START || endMagic(packet) != DATA_MAGIC_END) return none;

    const metadataSz = metadataSize(packet);
    const dataSz = dataSize(packet);
    if (raw.length != DATA_SZ_MIN + metadataSz + dataSz) return none;

    return some(packet);
}

export const toBytes = u;


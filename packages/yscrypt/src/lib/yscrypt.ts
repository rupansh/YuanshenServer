import { mt64Rand } from "@ysparadox/mt64";
import Long from "long";

export function ysXor(key: Buffer, data: Buffer) {
  for (let i = 0; i < data.length; i += 1) {
    data[i] ^= key[i % key.length];
  }
}

export function ysGenKey(baseKey: Buffer, seed: Long, legacy: boolean) {
  if (baseKey.length % 8 != 0) throw Error("Invalid key length");

  const mt64 = mt64Rand(seed);

  if (!legacy) {
    const nSeed = mt64.next();
    mt64.reseed(nSeed);
    mt64.next();
  }

  for (let i = 0; i < baseKey.length/8; i += 1) {
    const by = mt64.next().toBytes(false);
    for (let j = 0; j < by.length; j += 1) {
      baseKey[i*8 + j] = by[j];
    }
  }
}
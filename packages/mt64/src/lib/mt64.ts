/*
  MT19937-64 (2014/2/23)
  Based on C implementation by akuji Nishimura and Makoto Matsumoto
*/

import Long = require("long");

const NN = 312;
const MM = 156;
const MATRIX_A = Long.fromString("0xb5026f5aa96619e9", true, 16);
const UM = Long.fromString("0xffffffff80000000", true, 16);
const LM = Long.fromNumber(0x7fff_ffff, true);

// Pre-Computed 64 bit values
const MUL_A = Long.fromString("6364136223846793005", true);
const TEMPER_1 = Long.fromString("0x5555555555555555", true, 16);
const TEMPER_2 = Long.fromString("0x71d67fffeda60000", true, 16);
const TEMPER_3 = Long.fromString("0xfff7eee000000000", true, 16);

export function mt64Rand(seed: Long) {
  const mt = new Array<Long>(NN);
  let mti = 0;

  function reseed(seed: Long) {
    mti = NN;
    mt[0] = seed;
    for (let i = 1; i < NN; i += 1) {
      // MUL_A * (mt[i-1] ^ (mt[i-1] >> 62)) + i
      mt[i] = MUL_A.mul( mt[i-1].xor(mt[i-1].shru(Long.fromNumber(62))) ).add(i);
    }
  }

  reseed(seed);

  return {
    reseed,
    next(): Long {
      if (mti >= NN) {
        for (let i = 0; i < NN-MM; i += 1) {
          // x = (mt[i] & UM) | (mt[i+1] & LM)
          const x = (mt[i].and(UM)).or(mt[i+1].and(LM));
          // mt[i] = mt[i+MM] ^ (x >> 1) ^ ((x & 1) * MATRIX_A)
          mt[i] = mt[i+MM].xor(x.shru(Long.ONE)).xor((x.and(Long.ONE)).mul(MATRIX_A));
        }

        for (let i = NN - MM; i < NN - 1; i += 1) {
          const x = (mt[i].and(UM)).or(mt[i+1].and(LM));
          mt[i] = mt[i+(MM-NN)].xor(x.shru(Long.ONE)).xor((x.and(Long.ONE)).mul(MATRIX_A));
        }
        const x = (mt[NN-1].and(UM)).or(mt[0].and(LM));
        mt[NN-1] = mt[MM-1].xor(x.shru(Long.ONE)).xor((x.and(Long.ONE)).mul(MATRIX_A));
        mti = 0;
      }

      let x = mt[mti];
      mti += 1;

      // x ^= (x >> 29) & TEMPER_1
      x = x.xor( x.shru(29).and(TEMPER_1) );
      x = x.xor( x.shl(17).and(TEMPER_2) );
      x = x.xor( x.shl(37).and(TEMPER_3) );
      x = x.xor( x.shru(43) );

      return x;
    }
  }
}

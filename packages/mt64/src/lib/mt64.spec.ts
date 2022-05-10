import assert from "assert";
import Long from 'long';
import { mt64Rand } from './mt64';

describe('mt64', () => {
  it('test mt64 5489', () => {
    const mt64 = mt64Rand(Long.fromNumber(5489));
    const ret = [
      Long.fromString('14514284786278117030', true),
      Long.fromString('4620546740167642908', true),
      Long.fromString('13109570281517897720', true),
      Long.fromString('17462938647148434322', true),
      Long.fromString('355488278567739596', true),
      Long.fromString('7469126240319926998', true),
      Long.fromString('4635995468481642529', true),
      Long.fromString('418970542659199878', true),
      Long.fromString('9604170989252516556', true),
      Long.fromString('6358044926049913402', true),
      Long.fromString('5058016125798318033', true),
      Long.fromString('10349215569089701407', true),
      Long.fromString('2583272014892537200', true),
      Long.fromString('10032373690199166667', true),
      Long.fromString('9627645531742285868', true),
      Long.fromString('15810285301089087632', true),
      Long.fromString('9219209713614924562', true),
      Long.fromString('7736011505917826031', true),
      Long.fromString('13729552270962724157', true),
      Long.fromString('4596340717661012313', true),
      Long.fromString('4413874586873285858', true),
      Long.fromString('5904155143473820934', true),
      Long.fromString('16795776195466785825', true),
      Long.fromString('3040631852046752166', true),
      Long.fromString('4529279813148173111', true),
      Long.fromString('3658352497551999605', true),
      Long.fromString('13205889818278417278', true),
      Long.fromString('17853215078830450730', true),
      Long.fromString('14193508720503142180', true),
      Long.fromString('1488787817663097441', true)
    ]

    for (const r of ret) {
      const v = mt64.next();
      assert(r.eq(v), `didn't match. exp: ${r.toString()}, found: ${v.toString()}`)
    } 
  });
});

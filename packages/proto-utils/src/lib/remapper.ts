import { PropType, PropValue } from "@ysparadox/ysproto";

export function propTypeRemap(props: Partial<Record<PropType, number>>) {
    const ents = Object.entries(props);
    return Object.fromEntries(ents.flatMap(([propT, propV]) => {
        if (!propV) return [];

        const v = PropValue.create({
            type: parseInt(propT),
            val: BigInt(propV),
            value: { oneofKind: "ival", ival: BigInt(propV) }
        });

        return [[propT, v]];
    })) as Record<number, PropValue>;
}
import { FightPropPair, FightPropType, PropPair, PropType, PropValue } from "@ysparadox/ysproto";

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

export function propTypeMapToPair(props: Partial<Record<PropType, number>>): PropPair[] {
    const ents = Object.entries(props);

    return ents.map(([k, v]) => {
        const propV = PropValue.create({
            type: parseInt(k),
            val: BigInt(v),
            value: { oneofKind: "ival", ival: BigInt(v) }
        });
        return PropPair.create({
            type: parseInt(k),
            propValue: propV
        });
    })
}

export function fightPropMapToPair(props: Partial<Record<FightPropType, number>>): FightPropPair[] {
    const ents = Object.entries(props);

    return ents.map(([k, v]) => FightPropPair.create({
        propType: parseInt(k),
        propValue: v
    }));
}
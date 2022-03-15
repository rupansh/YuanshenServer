import { AbilityControlBlock, AbilityEmbryo } from "@ysparadox/ysproto";

const ABILITY_ATTRS = [
    [1, 0x05FF9657],
    [2, 0x0797D262],
    [3, 0x0C7599F3],
    [4, 0x1DAA7B46],
    [5, 0x1EE50216],
    [6, 0x279C736A],
    [7, 0x31306655],
    [8, 0x3404DEA1],
    [9, 0x35A975DB],
    [10, 0x36BCE44F],
    [11, 0x3E8B0DC0],
    [12, 0x43732FB4],
    [13, 0x441D271F],
    [14, 0x540E3E8E],
    [15, 0x57E91C26],
    [16, 0x5D3EEA62],
    [17, 0x5E10F925],
    [18, 0x74BF7A58],
    [19, 0x8973B6B7],
    [20, 0x9E17FC49],
    [21, 0xB4BD9D18],
    [22, 0xB5F36BFE],
    [23, 0xB91C23F9],
    [24, 0xBC3037E5],
    [25, 0xC34FDBD9],
    [26, 0xC3B1A5BB],
    [27, 0xC92024F2],
    [28, 0xCC650F14],
    [29, 0xCC650F15],
    [30, 0xD6820468],
    [31, 0xE0CCEE0D],
    [32, 0xE46A6608],
    [33, 0xF338F895],
    [34, 0xF56F5546],
    [35, 0xF8B2753E],
    [36, 0xFD8E4031],
    [37, 0xFFC8EAB3],
];

export const FAKE_DEFAULT_ABILITIES = AbilityControlBlock.create({
    abilityEmbryoList: ABILITY_ATTRS.map(([, attr]) => AbilityEmbryo.create({
        abilityNameHash: attr,
        abilityOverrideNameHash: 0x463810D9,
    }))
});
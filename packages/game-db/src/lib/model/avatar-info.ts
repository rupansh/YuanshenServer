import Long = require("long")

export type AvatarInfo = {
    uid: number,
    characterId: number,
    avatarType: number,
    guid: Long,
    bornTime: number
}
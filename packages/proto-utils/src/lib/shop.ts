import { ShopGoods, ShopRotate } from "@ysparadox/ysjson";

type KToNumber<T, K extends keyof T> = T[K] extends number ? T & Record<K, number> : never

const convToMap = <T, K extends keyof T>(k: K, vs: KToNumber<T, K>[]) => {
    const ret: Record<number, T[]> = {};
    for (const v of vs) {
        const arr = ret[v[k]];
        if (arr) {
            arr.push(v)
        } else {
            ret[v[k]] = [v];
        }
    }
    return ret;
}

export function loadShopGoodsMap() {
    return convToMap("ShopType", Object.values(ShopGoods));
}

export function loadShopRotateMap() {
   return convToMap("RotateId", Object.values(ShopRotate));
}
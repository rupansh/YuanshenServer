import { GameDb } from "@ysparadox/game-db";
import { PacketHandlerRegistry } from "@ysparadox/packet-handler";
import { deserProtoTimestamp, loadShopGoodsMap, loadShopRotateMap, unwrap } from "@ysparadox/proto-utils";
import { BuyGoodsRsp, GetShopRsp, ShopGoods } from "@ysparadox/ysproto";
import { getOrElse } from "fp-ts/lib/Option";

export function registerShopSubSys(reg: PacketHandlerRegistry, db: GameDb) {
    const goodsMap = loadShopGoodsMap();
    const rotMap = loadShopRotateMap();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function getShopRefreshTime(_: number, __: number) {
        return Math.floor(Date.now()/1000) + 86400;
    }

    // Stub
    reg.register("BuyGoodsReq", "BuyGoodsRsp", async () => BuyGoodsRsp.create());

    reg.register("GetShopReq", "GetShopRsp", async (userId, _, req) => {
        const shopGoods = goodsMap[req.shopType] || [];
        // TODO: get by item id
        const nextRefreshTime = getShopRefreshTime(req.shopType, 0);

        const lvl = await db.getPlayerLevel(userId).then(unwrap);
        const goods = shopGoods.flatMap((item) => {
            if (lvl < item.MinShowLevel) return [];
            const itemId = item.ItemId || (item.RotateId && rotMap[item.RotateId][0].ItemId);
            if (!itemId) throw Error(`rotate not found ${item.RotateId}`)

            const itemRefreshTime = Math.min(getShopRefreshTime(req.shopType, itemId), nextRefreshTime);
            const beginTime = getOrElse(() => 0)(deserProtoTimestamp(item.BeginTime));
            const endTime = getOrElse(() => 0)(deserProtoTimestamp(item.EndTime));

            const costItemList = item.CostItems.flatMap((ci) => "Id" in ci && ci.Id  && ci.Id > 0 ? [{ itemId: ci.Id, count: ci.Count }] : []);

            return [ShopGoods.create({
                goodsId: item.GoodsId,
                goodsItem: { itemId, count: item.ItemCount },
                beginTime,
                endTime,
                nextRefreshTime: itemRefreshTime,
                minLevel: item.MinShowLevel,
                maxLevel: 0,
                buyLimit: item.BuyLimit || 0,
                costItemList,
                hcoin: item.CostHcoin || 0,
                mcoin: 0 /* item.CostMCoin */,
                scoin: item.CostScoin || 0
            })]
        });

        return GetShopRsp.create({
            shop: {
                shopType: req.shopType,
                goodsList: goods,
                nextRefreshTime
            }
        });
    });
}
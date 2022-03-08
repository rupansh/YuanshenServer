import { mockTokenGen, dispatchHandler } from "../utils"
import { DEFAULT_COMBO_COMBO, DEFAULT_GRANTER_CMP_PROT_V, DEFAULT_GRANTER_GET_CONFIG, verifyTokenV2 } from "./resps"

export type GranterData = {
    app_id: number | string,
    channel_id: number | string,
    device: string,
    sign: string,
    data: string
};

export function dispatchComboHandlers() {
    return {
        login: dispatchHandler<GranterData>(() => {
            const payload = verifyTokenV2(mockTokenGen());

            return [0, payload]
        }),
        getConfig: dispatchHandler<void>(() => [0, JSON.stringify(DEFAULT_GRANTER_GET_CONFIG)]),
        compareProtocolVersion: dispatchHandler<void>(() => [0, JSON.stringify(DEFAULT_GRANTER_CMP_PROT_V)]),
        combo: dispatchHandler<void>(() => [0, JSON.stringify(DEFAULT_COMBO_COMBO)])
    }
}
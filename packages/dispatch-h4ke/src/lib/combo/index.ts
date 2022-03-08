import { DispatchComboSvc } from "@ysparadox/dispatch-ints";
import { mockTokenGen, dispatchHandler } from "../utils"
import { DEFAULT_COMBO_COMBO, DEFAULT_GRANTER_CMP_PROT_V, DEFAULT_GRANTER_GET_CONFIG, verifyTokenV2 } from "./resps"

export function dispatchComboHandlers(): DispatchComboSvc {
    return {
        login: dispatchHandler(() => {
            const payload = verifyTokenV2(mockTokenGen());

            return [0, payload]
        }),
        getConfig: dispatchHandler(() => [0, JSON.stringify(DEFAULT_GRANTER_GET_CONFIG)]),
        compareProtocolVersion: dispatchHandler(() => [0, JSON.stringify(DEFAULT_GRANTER_CMP_PROT_V)]),
        combo: dispatchHandler(() => [0, JSON.stringify(DEFAULT_COMBO_COMBO)])
    }
}
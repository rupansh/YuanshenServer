// TODO: Ideally, these should be split
import { DispathcMiscSvc } from "@ysparadox/dispatch-ints";
import { dispatchHandler } from "../utils";


export function dispatchMiscHandlers(): DispathcMiscSvc {
    return {
        h5LogBatch: dispatchHandler(() => [0, null]),
        getAgreementInfos: dispatchHandler(() => [0, { marketing_agreements: [] }]),
        versionData: JSON.stringify({ version: 54 })
    }
}
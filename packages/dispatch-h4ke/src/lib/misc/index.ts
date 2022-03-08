// TODO: Ideally, these should be split

import { dispatchHandler } from "../utils";


export type MinorApiLogData = {
    data: string
}

export function dispatchMiscHandlers() {
    return {
        h5LogBatch: dispatchHandler<MinorApiLogData>(() => [0, null]),
        getAgreementInfos: dispatchHandler<void>(() => [0, JSON.stringify({ marketing_agreements: [] })]),
        versionData: JSON.stringify({ version: 54 })
    }
}
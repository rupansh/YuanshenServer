import { DispatchComboSvc, DispatchGeetestSvc, DispatchLoggerSvc, DispatchQuerySvc, DispatchRiskySvc, DispatchShieldSvc, DispathcMiscSvc } from "@ysparadox/dispatch-ints";
import { dispatchQueryHandlers } from "@ysparadox/dispatch-query";
import { dispatchComboHandlers, dispatchMiscHandlers, dispatchRiskyOldHandlers, dispatchShieldHandlers } from "@ysparadox/dispatch-h4ke";
import { mockDispatchLogger } from "@ysparadox/dispatch-logger";
import { dispatchGeetestHandlers } from "@ysparadox/dispatch-geetest";
import { loadYsKeys } from "@ysparadox/ys-keys";

export type Deps = {
    query: DispatchQuerySvc,
    shield: DispatchShieldSvc,
    risky: DispatchRiskySvc,
    combo: DispatchComboSvc,
    geetest: DispatchGeetestSvc,
    misc: DispathcMiscSvc,
    loggerSvc: DispatchLoggerSvc
}

async function querySvc() {
    return dispatchQueryHandlers(await loadYsKeys());
}

export async function deps() {
    return {
        query: await querySvc(),
        shield: dispatchShieldHandlers(),
        risky: dispatchRiskyOldHandlers(),
        combo: dispatchComboHandlers(),
        misc: dispatchMiscHandlers(),
        loggerSvc: mockDispatchLogger(),
        geetest: dispatchGeetestHandlers()
    }
}
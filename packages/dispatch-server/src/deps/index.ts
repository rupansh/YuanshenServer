import { DispatchComboSvc, DispatchGeetestSvc, DispatchLoggerSvc, DispatchQuerySvc, DispatchRiskySvc, DispatchShieldSvc, DispathcMiscSvc } from "@ysparadox/dispatch-ints";
import { DispatchKeys, dispatchQueryHandlers } from "@ysparadox/dispatch-query";
import { dispatchComboHandlers, dispatchMiscHandlers, dispatchRiskyOldHandlers, dispatchShieldHandlers } from "@ysparadox/dispatch-h4ke";
import { mockDispatchLogger } from "@ysparadox/dispatch-logger";
import { dispatchGeetestHandlers } from "@ysparadox/dispatch-geetest";
import * as fs from "fs";
import path = require("path");
import { QUERY_KEYS_LOC } from "./consts";

export type Deps = {
    query: DispatchQuerySvc,
    shield: DispatchShieldSvc,
    risky: DispatchRiskySvc,
    combo: DispatchComboSvc,
    geetest: DispatchGeetestSvc,
    misc: DispathcMiscSvc,
    loggerSvc: DispatchLoggerSvc
}

async function loadKeys(): Promise<DispatchKeys> {
    return {
        clientSk: await fs.promises.readFile(path.join(QUERY_KEYS_LOC, "master.key")),
        ec2b: await fs.promises.readFile(path.join(QUERY_KEYS_LOC, "master.ec2b"))
    }
}

async function querySvc() {
    return dispatchQueryHandlers(await loadKeys());
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
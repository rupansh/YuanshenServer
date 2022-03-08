import { DispatchRiskySvc } from "@ysparadox/dispatch-ints";
import { buildAccountData, DEFAULT_ACCOUNT_DATA } from "../payloads";
import { mockTokenGen, dispatchHandler } from "../utils";

export function dispatchRiskyOldHandlers(): DispatchRiskySvc {
  return {
    check: dispatchHandler(() => {
      const payload = buildAccountData({
        ...DEFAULT_ACCOUNT_DATA,
        token: mockTokenGen()
      });

      return [0, payload];
    })
  }
}
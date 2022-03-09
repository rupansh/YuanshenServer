import { DispatchShieldSvc } from "@ysparadox/dispatch-ints";
import { buildAccountData, DEFAULT_ACCOUNT_DATA } from "../payloads";
import { mockTokenGen, dispatchHandler } from "../utils";
import { DEFAULT_SHIELD_LOAD_CONFIG } from "./resps";

export function dispatchShieldHandlers(): DispatchShieldSvc {
  return {
    login: dispatchHandler(() => {
      const payload = buildAccountData({
        ...DEFAULT_ACCOUNT_DATA,
        token: mockTokenGen()
      });

      return [0, payload]
    }),
    verify: dispatchHandler((data) => {
      const payload = buildAccountData({
        ...DEFAULT_ACCOUNT_DATA,
        ...data
      });
      
      return [0, payload];
    }),
    loadConfig: dispatchHandler(() => [0, DEFAULT_SHIELD_LOAD_CONFIG]),
  }
}
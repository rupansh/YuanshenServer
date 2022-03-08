import { buildAccountData, DEFAULT_ACCOUNT_DATA } from "../payloads";
import { mockTokenGen, dispatchHandler } from "../utils";

export type ActionToCheck = {
  action_name: string,
  api_name: string,
  username?: string
}

export function dispatchRiskyOldHandlers() {
  return {
    check: dispatchHandler<ActionToCheck>(() => {
      const payload = buildAccountData({
        ...DEFAULT_ACCOUNT_DATA,
        token: mockTokenGen()
      });

      return [0, payload];
    })
  }
}
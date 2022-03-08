import { buildAccountData, DEFAULT_ACCOUNT_DATA } from "../payloads";
import { mockTokenGen, dispatchHandler } from "../utils";
import { DEFAULT_SHIELD_LOAD_CONFIG } from "./resps";

export type TokenToVerify = {
  uid: string,
  token: string
};

export type LoginData = {
  account: string,
  is_crypto: boolean,
  password: string
}

export function dispatchShieldHandlers() {
  return {
    login: dispatchHandler<LoginData>(() => {
      const payload = buildAccountData({
        ...DEFAULT_ACCOUNT_DATA,
        token: mockTokenGen()
      });

      return [0, payload]
    }),
    verify: dispatchHandler((data: TokenToVerify) => {
      const payload = buildAccountData({
        ...DEFAULT_ACCOUNT_DATA,
        ...data
      });
      
      return [0, payload];
    }),
    loadConfig: dispatchHandler<void>(() => [0, JSON.stringify(DEFAULT_SHIELD_LOAD_CONFIG)]),
  }
}
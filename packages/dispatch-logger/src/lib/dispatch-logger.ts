import { DispatchLoggerSvc } from "@ysparadox/dispatch-ints";

const logSkip: (data: Uint8Array) => string = () => "{}";

export function mockDispatchLogger(): DispatchLoggerSvc {
  return {
    logSdk: logSkip,
    sdk: logSkip,
    crash: logSkip
  }
}

const logSkip: (data: Uint8Array) => string = () => "{}";

export function mockDispatchLogger() {
  return {
    logSdk: logSkip,
    sdk: logSkip,
    crash: logSkip
  }
}

export type DispatchLoggerSvc = {
    logSdk: (data: Uint8Array) => string;
    sdk: (data: Uint8Array) => string;
    crash: (data: Uint8Array) => string;
}
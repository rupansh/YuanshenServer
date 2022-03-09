import { randomUUID } from "crypto";
import { buildDispatchResponse } from "./payloads";

export function mockTokenGen(): string {
  const uuid = randomUUID()
  return `${uuid.slice(0, 8)}${uuid.slice(9, 13)}${uuid.slice(14, 18)}${uuid.slice(19, 23)}${uuid.slice(24)}`;
}

export function dispatchHandler<R, T>(cb: (data: R) => [number, T | null]) {
    return (data: R) => {
        const [code, payload] = cb(data);
        return buildDispatchResponse(code, payload);
    }
}
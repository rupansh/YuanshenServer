import { geetestResp } from "./payload";

export function geetestHandler<R extends { callback?: string }>(cb: (data: R) => string) {
    return (data: R) => {
        const payload = cb(data);
        return geetestResp(data.callback || '', payload);
    }
}
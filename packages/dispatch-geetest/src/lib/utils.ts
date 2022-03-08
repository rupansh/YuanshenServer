import { geetestResp } from "./payload";

export function geetestHandler<R>(cb: (data: R & { callback?: string | undefined }) => string) {
    return (data: R & { callback?: string | undefined }) => {
        const payload = cb(data);
        return geetestResp(data.callback || '', payload);
    }
}
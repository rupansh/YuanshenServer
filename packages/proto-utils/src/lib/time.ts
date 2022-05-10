import moment from "moment";
import { tryCatch } from "fp-ts/lib/Option";

export function deserProtoTimestamp(ts: string) {
    return tryCatch(() => Math.trunc(moment("%Y-%m-%d %H:%M:%s", ts).valueOf()/1000));
}
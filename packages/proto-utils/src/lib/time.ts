import moment = require("moment");
import { tryCatch } from "fp-ts/lib/Option";

export function deserProtoTimestamp(ts: string) {
    return tryCatch(() => moment("%Y-%m-%d %H:%M:%s", ts).valueOf());
}
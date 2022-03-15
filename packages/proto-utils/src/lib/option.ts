import { isNone, Option } from "fp-ts/lib/Option";

export function unwrap<T>(o: Option<T>): T {
    if (isNone(o)) throw Error("failed to unwrap option");
    return o.value;
}
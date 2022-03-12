import { DispatchKeys } from "@ysparadox/dispatch-query";
import * as fs from "fs";
import path = require("path");

export const QUERY_KEYS_LOC = "assets/keys";

export async function loadYsKeys(): Promise<DispatchKeys> {
    return {
        xorKey: await fs.promises.readFile(path.join(QUERY_KEYS_LOC, "master.key")),
        ec2b: await fs.promises.readFile(path.join(QUERY_KEYS_LOC, "master.ec2b"))
    }
}

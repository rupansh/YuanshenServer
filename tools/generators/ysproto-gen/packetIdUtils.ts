import * as fs from "fs";
import * as readline from "readline";
import path = require("path");
import * as util from "util";

async function extractPacketId(protoPath: string): Promise<number | undefined> {
  const stream =  fs.createReadStream(protoPath);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.includes("CMD_ID")) continue;
    const cmdidl = line.split("=")
    if (cmdidl.length < 2) continue;
  
    const cmdid = parseInt(cmdidl[1].trim().replace(' ;', '').trim());
    if (cmdid == NaN) continue;
    return cmdid;
  }
  return undefined;
}

export async function generatePackedIds(protosLoc: string) {
  const ret: { [index: number]: string } = {};
  const protos = (await fs.promises.readdir(protosLoc)).filter(f => f.endsWith(".proto"));

  for (let i = 0; i < protos.length; i += 1) {
    const cmdid = await extractPacketId(path.join(protosLoc, protos[i]));
    if (!cmdid) continue;
    ret[cmdid] = protos[i].slice(0, protos[i].length - 6);
  }

  const retRev = Object.fromEntries(Object.entries(ret).map(([k, v]) => [v, k]));

  const packetIdsSrc = `export const packetIds = ${util.inspect(ret)} as const;
export const reversePacketIds = ${util.inspect(retRev)} as const;\n`;

  const genLoc = path.join(__dirname, "files/generated/packetIds.ts");
  await fs.promises.writeFile(genLoc, packetIdsSrc);
}
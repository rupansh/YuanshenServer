import { exec } from "child_process";
import { PROTOS, PROTOS_DEFAULT } from "./consts";
import path = require("path");

async function generateProtobufsIn(genLoc: string, protosLoc: string, protos: string[]) {
  const protoGenCmd = `pnpx protoc --ts_out ${genLoc} \
  --ts_opt generate_dependencies \
  --ts_opt add_pb_suffix \
  --ts_opt ts_nocheck \
  --proto_path ${protosLoc} \
  ${protos.join(" ")}`

  await new Promise<void>((r, rej) => exec(protoGenCmd, (e) => e ? rej(e) : r()));
}

export const generateProtoBufExports = () => PROTOS.map(p => `export * from "./generated/${p}_pb";`);
const generateProtoPaths = (protosLoc: string) => PROTOS.map(p => path.join(protosLoc, `${p}.proto`));

export async function generateProtoBufs(protosLoc: string) {
  const protos = generateProtoPaths(protosLoc);

  const genLoc = path.join(__dirname, "files/generated");

  await generateProtobufsIn(genLoc, protosLoc, protos);
}
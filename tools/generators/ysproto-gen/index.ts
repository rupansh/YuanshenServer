import { Tree, formatFiles, installPackagesTask, addDependenciesToPackageJson, generateFiles, readProjectConfiguration, writeJson } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';
import * as fs from 'fs';
import path = require('path');
import { PROTOS_DEFAULT, PROTOS_PROJECT } from './consts';
import { generatePackedIds } from './packetIdUtils';
import { generateProtoBufExports, generateProtoBufs } from './protobufUtils';

async function generateLibIndex() {
  const libExports = generateProtoBufExports();
  const packetIdExport = `import packetIds = require(\"./generated/packetIds.json\");
export { packetIds };`

  libExports.push(packetIdExport);

  const genIdx = path.join(__dirname, `files/${PROTOS_PROJECT}.ts`);

  await fs.promises.writeFile(genIdx, libExports.join("\n")); 
}

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, { name: PROTOS_PROJECT });
  addDependenciesToPackageJson(tree, { "@protobuf-ts/runtime": "latest" }, {});

  const protosLoc = schema.protos || PROTOS_DEFAULT;
  const libRoot = readProjectConfiguration(tree, PROTOS_PROJECT).root;

  await generateProtoBufs(protosLoc);
  await generateLibIndex();
  const packetIds = await generatePackedIds(protosLoc);

  writeJson(tree, path.join(libRoot, "src/lib/generated/packetIds.json"), packetIds);
  generateFiles(tree, path.join(__dirname, "files"), path.join(libRoot, "src/lib"), {});

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

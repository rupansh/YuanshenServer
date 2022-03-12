import { Tree, formatFiles, installPackagesTask, addDependenciesToPackageJson, generateFiles, readProjectConfiguration, writeJson, addProjectConfiguration } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import * as fs from 'fs';
import path = require('path');
import { PROTOS_DEFAULT, PROTOS_PROJECT } from './consts';
import { generatePackedIds } from './packetIdUtils';
import { generateProtoBufExports, generateProtoBufs } from './protobufUtils';

async function generateLibIndex() {
  const libExports = generateProtoBufExports();
  const packetIdExport = `export * from \"./generated/packetIds\";`

  libExports.push(packetIdExport);

  const genIdx = path.join(__dirname, `files/${PROTOS_PROJECT}.ts`);

  await fs.promises.writeFile(genIdx, libExports.join("\n")); 
}

export default async function (tree: Tree, schema: any) {
  await libraryGenerator(tree, { name: PROTOS_PROJECT, buildable: true, linter: "none" });
  addDependenciesToPackageJson(tree, { "@protobuf-ts/runtime": "latest" }, {});

  const projectConfig = readProjectConfiguration(tree, PROTOS_PROJECT);
  const protosLoc = schema.protos || PROTOS_DEFAULT;
  const libRoot = projectConfig.root;

  await generateProtoBufs(protosLoc);
  await generateLibIndex();
  await generatePackedIds(protosLoc);

  generateFiles(tree, path.join(__dirname, "files"), path.join(libRoot, "src/lib"), {});

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}
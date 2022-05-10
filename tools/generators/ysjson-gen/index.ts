import { Tree, formatFiles, installPackagesTask, readProjectConfiguration, generateFiles } from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/workspace/generators";
import { JSONS, JSONS_DEFAULT, JSONS_PROJECT } from "./consts";
import * as fs from "fs";
import path = require("path");


export default async function (tree: Tree) {
  await libraryGenerator(tree, { name: JSONS_PROJECT, buildable: true, linter: "none" });

  const projectConfig = readProjectConfiguration(tree, JSONS_PROJECT);
  const jsonsLoc = JSONS_DEFAULT;
  const libRoot = projectConfig.root;

  const genLoc = path.join(__dirname, "files/generated")
  const imports: string[] = [];

  for (const json of JSONS) {
    const file = `${json}ExcelConfigData.json`
    imports.push(`import * as ${json} from \"./generated/${file}\";`);
    const loc = path.join(jsonsLoc, file);
    await fs.promises.copyFile(loc, path.join(genLoc, file));
  }

  const genIdx = path.join(__dirname, `files/${JSONS_PROJECT}.ts`) 
  const idxContent = `${imports.join("\n")}\nexport { ${JSONS.join(",")} }`

  await fs.promises.writeFile(genIdx, idxContent)

  generateFiles(tree, path.join(__dirname, "files"), path.join(libRoot, "src/lib"), {});

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
}

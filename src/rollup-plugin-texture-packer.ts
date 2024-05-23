/**
 * Rollup plugin to pack images using the free-tex-packer-core library.
 * @module RollupPluginTexturePacker
 */


import {Plugin} from "rollup";
import {packAsync, TexturePackerOptions} from "free-tex-packer-core";
import * as fs from "node:fs/promises";
import {glob} from "glob";

/**
 * The options for the Rollup plugin.
 * @typedef {Object} RollupPluginTexturePackerOptions
 * @property {string} inputDir - The directory to find the images to pack.
 * @property {string} outputDir - The directory to output the packed images.
 * @property {TexturePackerOptions[] | TexturePackerOptions} options - The options for the texture packer.
 */
export type RollupPluginTexturePackerOptions = {
  inputDir: string;
  outputDir: string;
  options?: TexturePackerOptions[] | TexturePackerOptions;
};

/**
 * Rollup plugin to pack images using the free-tex-packer-core library.
 * @typedef {Function} RollupPluginTexturePacker
 * @param {RollupPluginTexturePackerOptions} options - The options for the texture packer.
 * @returns {Plugin} - The Rollup plugin.
 */
export type RollupPluginTexturePacker = (
  options: RollupPluginTexturePackerOptions,
) => Plugin;

const writeFile = async (name: string, buffer: Buffer, outputDir: string) => {
  try {
    await fs.writeFile(`${outputDir}/${name}`, buffer, {
      encoding: "binary",
    });
  } catch (err) {
    console.error(`Error writing file ${name}: ${err}`);
  }
};

const findImages = async (
  inputDir: string,
): Promise<
  {
    path: string;
    contents: Buffer;
  }[]
> => {
  const files = glob.sync("**/*.png", {
    cwd: inputDir,
  });
  return Promise.all(
    files.map(async (file) => {
      console.info(`Found image: ${inputDir}/${file}`);
      const contents = await fs.readFile(`${inputDir}/${file}`);
      return {
        path: file,
        contents: Buffer.from(contents),
      };
    }),
  );
};

const packImages = async ({
  inputDir,
  outputDir,
  options,
}: RollupPluginTexturePackerOptions) => {
  const images = await findImages(inputDir);

  const packer = async (option?: TexturePackerOptions) => {
    try {
      const files = await packAsync(images, option);
      await Promise.all(
        files.map((file) => writeFile(file.name, file.buffer, outputDir)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (Array.isArray(options)) {
    await Promise.all(options.map(packer));
  } else {
    await packer(options);
  }
};

/**
 * Rollup plugin to pack images using the free-tex-packer-core library.
 * @param {RollupPluginTexturePackerOptions} options - The options for the texture packer.
 * @returns {Plugin} - The Rollup plugin.
 */
const RollupPluginTexturePacker: RollupPluginTexturePacker = (options) => {
  const packer = () => packImages(options);

  return {
    name: "rollup-plugin-texture-packer",

    async configResolved() {
      await packer();
    },

    resolveId(source) {
      if (source === "virtual-module") {
        // this signals that Rollup should not ask other plugins or check
        // the file system to find this id
        return source;
      }
      return null; // other ids should be handled as usually
    },
    load(id) {
      if (id === "virtual-module") {
        // the source code for "virtual-module"
        return 'export default "This is virtual!"';
      }
      return null; // other ids should be handled as usually
    },
  };
};

export * from "./TexturePackerEnums.ts";

export type { TexturePackerOptions };

export default RollupPluginTexturePacker;

# Rollup Plugin Texture Packer

## Description

This project uses a Rollup plugin to pack images using the free-tex-packer-core library. It is written in TypeScript.

## Installation

To install this package, run the following command:

npm

```bash
npx jsr add @snrn/rollup-plugin-texture-packer
```

yarn

```bash
yarn dlx jsr add @snrn/rollup-plugin-texture-packer
```

## Usage

### Rollup or Vite

```typescript
import texturePacker, {PackerExporterType} from '@snrn/rollup-plugin-texture-packer';

export default {
    plugins: [
        texturePacker({
            inputDir: 'path/to/input',
            outputDir: 'path/to/output',
            options: {
                textureName: "css",
                prependFolderName: false,
                exporter: PackerExporterType.CSS,
            }
        })
    ]
};
```

### Options

- `input` - The input directory where the images are located.
- `output` - The output directory where the atlas and the images will be saved.
- `options` - Options or an array of options. Uses free-tex-packer-core options. [See here](https://www.npmjs.com/package/free-tex-packer-core#available-options). Multiple options can be passed to generate multiple atlases.


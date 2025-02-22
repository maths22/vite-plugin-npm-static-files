import type { Plugin, Rollup } from "vite";
import { readFileSync } from 'fs';

async function readNpmFile(context: Rollup.PluginContext, path: string) {
  const resolveInfo = await context.resolve(`${path}?url`)
  if (!resolveInfo) {
    throw new Error(`Could not find ${path}`)
  }
  const fsPath = resolveInfo.id.replace('?url', '')
  return readFileSync(fsPath, 'binary')
}

function CopyNpmAssetsPlugin(staticNpmFiles: Record<string, string>): Plugin {
  return {
    name: 'npm-asset-copier',
    apply: 'build',
    buildStart: async function () {
      for (const [dest, src] of Object.entries(staticNpmFiles || {})) {
        this.emitFile({
          name: `npm/${dest}`,
          originalFileName: `npm/${dest}`,
          type: 'asset',
          source: await readNpmFile(this, src)
        })
      }
    },
  }
}

function ServeNpmAssetsPlugin(staticNpmFiles: Record<string, string>): Plugin {
  return {
    name: 'npm-asset-server',
    apply: 'serve',
    enforce: 'pre',
    resolveId: function (id) {
      if(staticNpmFiles && id.startsWith('/npm/') && id.replace(/^\/npm\//, '') in staticNpmFiles) {
        return id.replace(/^\/npm\//, "\0npm:")
      }
    },
    load: async function (id) {
      if(staticNpmFiles && id.startsWith('\0npm:')) {
        const src = staticNpmFiles[id.split(':')[1]]

        return await readNpmFile(this, src)
      }
    },
  }
}

function npmStaticFilesPlugin(staticNpmFiles: Record<string, string>): Plugin[] {
  return [
    CopyNpmAssetsPlugin(staticNpmFiles),
    ServeNpmAssetsPlugin(staticNpmFiles)
  ]
}

export default npmStaticFilesPlugin;

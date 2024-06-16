# vite-plugin-npm-static-files

Vite plugin to serve raw files from NPM as static assets. For example,
if you have a legacy app that requires unbundled jQuery in addition to
bundled components, and you would like to use vite, you may still want
to be able to load jQuery from its NPM package instead of copying it
into your project or loading it from a CDN.

## Limitations

At present, this plugin will not rewrite references to such files in 
index.html, which means it is only useful if integrated with a backend
(e.g. ASP.net, rails, etc), as described in [Backend Integration](https://vitejs.dev/guide/backend-integration.html)

## Usage

In your `vite.config.ts`, add the plugin with an object mapping file names to package paths.  Files will be served at `/npm/<name>`

```ts
import { defineConfig } from "vite";
import npmStaticFilePlugin from "../src/index";

export default defineConfig({
	plugins: [
		npmStaticFilePlugin({
      'jquery.js': 'jquery/dist/jquery.min.js',
    })
	],
});
```
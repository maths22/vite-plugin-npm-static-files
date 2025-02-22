import { defineConfig } from "vite";
import npmStaticFilePlugin from "../src/index";

export default defineConfig({
	build: {
		manifest: true,
	},
	plugins: [
		npmStaticFilePlugin({
      'jquery.js': 'jquery/dist/jquery.min.js',
    })
	],
});
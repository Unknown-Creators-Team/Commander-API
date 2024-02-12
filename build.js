const esbuild = require('esbuild');
const glob = require('glob');
const fsExtra = require("fs-extra");
const entryPoints = glob.globSync('./src/**/*.ts').filter(f => !f.endsWith("index.d.ts"));

const isDev = process.argv[2] === "dev";

const dir = "./scripts";

if (!fsExtra.existsSync(dir)) {
    fsExtra.mkdirSync(dir);
}
fsExtra.emptyDirSync(dir);

(async () => {
    const context = await esbuild.context({
        "entryPoints": entryPoints,
        "outdir": "scripts",
        "platform": "neutral",
        "sourcemap": true,
        "target": "es2020",
        "banner": {
            "js":
                `
/**
 * 
 * ░█████╗░░█████╗░███╗░░░███╗███╗░░░███╗░█████╗░███╗░░██╗██████╗░███████╗██████╗░  ░█████╗░██████╗░██╗
 * ██╔══██╗██╔══██╗████╗░████║████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝██╔══██╗  ██╔══██╗██╔══██╗██║
 * ██║░░╚═╝██║░░██║██╔████╔██║██╔████╔██║███████║██╔██╗██║██║░░██║█████╗░░██████╔╝  ███████║██████╔╝██║
 * ██║░░██╗██║░░██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚████║██║░░██║██╔══╝░░██╔══██╗  ██╔══██║██╔═══╝░██║
 * ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░╚═╝░██║██║░░██║██║░╚███║██████╔╝███████╗██║░░██║  ██║░░██║██║░░░░░██║
 * ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═╝░░╚═╝╚═╝░░░░░╚═╝
 * 
 * @LICENSE GNU General Public License v3.0
 * @AUTHORS Nano, arutaka
 * @LINK https://github.com/191225/Commander-API
 */
`
        }
    });

    await context.rebuild();

    console.log(`[${new Date().toLocaleString()}] 初期ビルドが完了しました。`);

    if (isDev) {
        await context.watch();

        console.log(`watching`);
    }
})();
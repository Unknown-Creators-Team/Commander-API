const chokidar = require("chokidar");
const glob = require("glob");
const esbuild = require("esbuild");
const fse = require("fs-extra");
const colors = require("colors");

colors.enable();

const OUTPUT_DIR = "scripts";

/** @type { {[key: string]: string} } */
const ALIASES = {
}

/**
 * @type { esbuild.SameShape<esbuild.BuildOptions, esbuild.BuildOptions> }
 */
const CONTEXT = {
    outdir: OUTPUT_DIR,
    platform: "neutral",
    target: "es2020",
    format: "esm",
    sourcemap: true,

    banner: {
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
}

const entryPoints = glob.globSync("src/**/*.ts");
const isWatch = process.argv[2] === "watch";

if (fse.existsSync(OUTPUT_DIR)) {
    fse.removeSync(OUTPUT_DIR);
}

fse.mkdirSync(OUTPUT_DIR);

/**
 * 
 * @param { string } filePath 単体ファイルでビルドする場合はファイルパスを指定する
 * @returns { Promise<boolean> }
 */
async function build(filePath = undefined) {
    try {
        if (!filePath) {
            const context = await esbuild.context({
                entryPoints: entryPoints,
                ...CONTEXT
            });

            await context.rebuild();

            for (const filePath of entryPoints) {
                const outPath = filePath.replace("src", OUTPUT_DIR).replace(".ts", ".js");
                let file = fse.readFileSync(outPath, "utf-8");

                for (const alias in ALIASES) {
                    const regex = new RegExp(`"${alias}/`, "g");

                    file = file.replace(regex, '"' + ALIASES[alias] + "/");
                }

                fse.writeFileSync(outPath, file);

                return true;
            }
        } else {
            const context = await esbuild.context({
                entryPoints: [filePath],
                ...CONTEXT
            });

            await context.rebuild();

            const outPath = filePath.replace("src", OUTPUT_DIR).replace(".ts", ".js");
            let file = fse.readFileSync(outPath, "utf-8");

            for (const alias in ALIASES) {
                const regex = new RegExp(`"${alias}/`, "g");

                file = file.replace(regex, '"' + ALIASES[alias] + "/");
            }

            fse.writeFileSync(outPath, file);

            return true;
        }
    } catch (e) {
        console.error(`${getDate().cyan} ビルド中にエラーが発生しました。`.red);
        return false;
    }
}

function getDate() {
    const date = new Date();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    const millisecond = date.getMilliseconds().toString().padStart(3, "0");

    return `[${hour}:${minute}:${second}.${millisecond}]`;
}

(async () => {
    await build();

    console.log(`${getDate().cyan} 初期ビルドが完了しました。`.green);

    if (isWatch) {
        const watcher = chokidar.watch("src/**/*.ts", {
            persistent: true,
        });

        watcher.on("ready", () => {
            console.log(`${getDate().cyan} ファイルの変更を監視中...`.green);

            watcher.on("add", async (path) => {
                entryPoints.push(path);

                console.log(`${getDate().cyan} 監視対象に ${path} が追加されました。`.yellow);
            });

            watcher.on("change", async (path) => {
                console.log(`${getDate().cyan} ${path} が変更されました。`.yellow);

                const status = await build(path);

                if (status) {
                    console.log(`${getDate().cyan} ${path} のリビルドが完了しました。`.green);
                }
            });

            watcher.on("unlink", async (path) => {
                entryPoints.splice(entryPoints.indexOf(path), 1);

                console.log(`${getDate().cyan} 監視対象から ${path} が削除されました。`.yellow);

                const outPath = path.replace("src", OUTPUT_DIR).replace(".ts", ".js");

                if (fse.existsSync(outPath)) {
                    fse.unlinkSync(outPath);
                    console.log(`${getDate().cyan} ${path} の削除が完了しました。`.green);
                }
            });
        });
    }
})();
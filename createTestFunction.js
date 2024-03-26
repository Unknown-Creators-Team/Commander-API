const fs = require("fs");
const path = require("path");
const glob = require("glob");

const REGEXP = /(GameTest.register|GameTest.registerAsync)\("commander_api", "(.+)"/i;
const outputPath = path.join(__dirname, "functions", "Capi", "checks", "runalltests.mcfunction");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

const filePaths = glob.globSync("src/checks/*.ts")
    .filter((v) => !v.endsWith("checkLoader.ts"));

/** @type { string[] } */
const resultFunction = [];

for (let i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    const file = fs.readFileSync(filePath, "utf-8");

    const match = file.match(REGEXP);

    if (!match) {
        console.log(`No test function found in ${filePath}`);
        continue;
    }

    const testName = match[2];

    resultFunction.push(`execute @s ~${i * 8}~~ gametest run commander_api:${testName}`);

    console.log(`added ${testName}`);
}

fs.writeFileSync(outputPath, resultFunction.join("\n"));
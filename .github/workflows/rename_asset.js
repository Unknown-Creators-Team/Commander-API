// rename_asset.js
const fs = require("fs");
const axios = require("axios");
const path = require("path");

async function main() {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;
    const tag = process.env.GITHUB_REF.split("/").pop();
    const releaseId = process.env.GITHUB_EVENT_PATH;

    const { data: assets } = await axios.get(`https://api.github.com/repos/${repo}/releases/${releaseId}/assets`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    console.log("Assets:", assets);
    const oldName = assets[0].name;
    const newName = `${repo}-${tag}${path.extname(oldName)}`;
    console.log(`Renaming '${oldName}' to '${newName}'`);

    fs.renameSync(oldName, newName);
}

main().catch((err) => console.error(err));

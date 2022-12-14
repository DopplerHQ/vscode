const vscode = require("vscode");

module.exports = async function () {
  vscode.env.openExternal("https://docs.doppler.com");
};

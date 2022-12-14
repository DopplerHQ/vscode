const vscode = require("vscode");
const helpers = require("../helpers");
const doppler = require("../doppler");

module.exports = async function () {
  if (!(await doppler.auth.isAuthenticated())) {
    vscode.window.showWarningMessage(
      `You are already logged out of the Doppler.`
    );
    return;
  }

  await helpers.terminal.run("doppler logout --yes");
  await vscode.commands.executeCommand("doppler.explorer.refresh");
  vscode.window.showInformationMessage(`Doppler logout was successful.`);
};

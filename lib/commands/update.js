const vscode = require("vscode");
const doppler = require("../doppler");
const helpers = require("../helpers");

module.exports = async function () {
  if (!(await doppler.auth.hasDopplerCLI())) {
    await vscode.window.showErrorMessage(
      "The Doppler CLI must be installed first before it can be updated."
    );

    return;
  }

  await helpers.terminal.run("doppler update");
  const version = await helpers.terminal.run("doppler -v");
  await vscode.window.showInformationMessage(
    `The Doppler CLI has been updated to version ${version}.`
  );
};

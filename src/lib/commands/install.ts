import * as vscode from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";

export class InstallFailedError extends Error {}

export default async function () {
  if (await doppler.auth.hasDopplerCLI()) {
    return;
  }

  const hasCurl = await helpers.terminal.exists("curl");
  const hasWget = await helpers.terminal.exists("wget");
  const hasGPG = await helpers.terminal.exists("gpg");

  // Check if the required dependencies are installed
  if (!(hasCurl || hasWget) || !hasGPG) {
    const message =
      "We failed to automatically install the Doppler CLI. Please install it manually by going to our documentation.";
    const response = await vscode.window.showErrorMessage(message, { modal: true }, "Open Documentation");

    if (response === "Open Documentation") {
      vscode.env.openExternal(vscode.Uri.parse("https://docs.doppler.com/docs/install-cli"));
    }

    throw new InstallFailedError("Automated install of Doppler CLI failed. Please install manually.");
  }

  if (hasCurl) {
    await helpers.terminal.prompt(`curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sudo sh`);
  } else if (hasWget) {
    await helpers.terminal.prompt(`wget -t 3 -qO- https://cli.doppler.com/install.sh | sudo sh`);
  }

  // Check if the Doppler CLI was installed every 2 seconds and abort after 5 minutes
  await helpers.interval(2000, 300000, async function (clearInterval) {
    if (await doppler.auth.hasDopplerCLI()) {
      clearInterval();
      vscode.window.showInformationMessage(`The Doppler CLI has been installed`);
      await vscode.commands.executeCommand("doppler.explorer.refresh");
    }
  });
}

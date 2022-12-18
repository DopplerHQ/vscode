import * as vscode from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";

export default async function () {
  if (!(await doppler.auth.isAuthenticated())) {
    vscode.window.showWarningMessage(`You are already logged out of Doppler.`);
    return;
  }

  await helpers.terminal.run(
    `doppler logout --yes --scope=${helpers.terminal.workingDirectory()}`
  );
  await vscode.commands.executeCommand("doppler.explorer.refresh");
  vscode.window.showInformationMessage(`Doppler logout was successful`);
}

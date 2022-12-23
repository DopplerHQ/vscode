import { window, commands } from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";

export default async function () {
  if (!(await doppler.auth.isAuthenticated())) {
    window.showWarningMessage(`You are already logged out of the Doppler.`);
    return;
  }

  await helpers.terminal.run("doppler", ["logout", "--yes", `--scope=${helpers.terminal.workingDirectory()}`]);
  await commands.executeCommand("doppler.explorer.refresh");
  window.showInformationMessage(`Doppler logout was successful`);
}

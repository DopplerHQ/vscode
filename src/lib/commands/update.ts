import * as vscode from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";

export default async function () {
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
}

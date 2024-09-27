import { window } from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";

export default async function (args: any) {
  const config = args.config;
  const project = args.project;
  if (!(await doppler.auth.hasDopplerCLI())) {
    await window.showErrorMessage("The Doppler CLI must be installed first before it can be updated.");

    return;
  }

  await helpers.terminal.run("doppler", ["setup", `--project=${project}`, `--config=${config}`]);
  await window.showInformationMessage(`Doppler has been configured for ${project}.${config}`);
}

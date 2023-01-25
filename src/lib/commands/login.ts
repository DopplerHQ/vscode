import { window, commands } from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";

export default async function () {
  await helpers.terminal.prompt("doppler login");

  // Check if login was successful every 2 seconds and abort after 5 minutes
  await helpers.interval(2000, 300000, async function (clearInterval) {
    if (await doppler.auth.isAuthenticated()) {
      clearInterval();

      window.showInformationMessage(`Doppler login was successful`);
      await commands.executeCommand("doppler.explorer.refresh");
    }
  });
}

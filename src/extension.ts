import { ExtensionContext } from "vscode";
import commands from "./lib/commands";
import autocomplete from "./lib/autocomplete";
import hover from "./lib/hover";
import explorer from "./lib/explorer";

export function activate(context: ExtensionContext) {
  // Activate Plugins
  commands(context);
  autocomplete(context);
  hover(context);
  explorer(context);

  console.log("Doppler VS Code Plugin has been enabled.");
}

export function deactivate() {
  console.log("Doppler VS Code Plugin has been disabled.");
}

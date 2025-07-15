import { commands, ExtensionContext } from "vscode";
import login from "./login";
import logout from "./logout";
import setup from "./setup";
import documentation from "./documentation";
import install from "./install";
import update from "./update";
import selectConfig from "./select-config";

export default function (context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand("doppler.login", login));

  context.subscriptions.push(commands.registerCommand("doppler.logout", logout));

  context.subscriptions.push(commands.registerCommand("doppler.setup", setup));

  context.subscriptions.push(commands.registerCommand("doppler.documentation", documentation));

  context.subscriptions.push(commands.registerCommand("doppler.install", install));

  context.subscriptions.push(commands.registerCommand("doppler.update", update));

  context.subscriptions.push(commands.registerCommand('doppler.selectConfig', selectConfig));
}

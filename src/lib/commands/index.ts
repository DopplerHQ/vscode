import * as vscode from "vscode";
import login from "./login";
import logout from "./logout";
import setup from "./setup";
import documentation from "./documentation";
import install from "./install";
import update from "./update";

export default function (context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("doppler.login", login)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doppler.logout", logout)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doppler.setup", setup)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doppler.documentation", documentation)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doppler.install", install)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doppler.update", update)
  );
}

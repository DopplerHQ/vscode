import * as vscode from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";
import DopplerEditorProvider from "./editor_provider";

class DopplerExplorer {
  constructor(context: vscode.ExtensionContext) {
    const treeDataProvider = new DopplerEditorProvider(context);

    vscode.window.createTreeView("doppler-explorer", {
      treeDataProvider: treeDataProvider,
    });

    context.subscriptions.push(
      vscode.workspace.registerTextDocumentContentProvider(
        "doppler",
        treeDataProvider
      )
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        `doppler.explorer.editor.config.dashboard`,
        () => {
          this.open_config_dashboard();
        }
      )
    );

    vscode.workspace.onDidOpenTextDocument(async (document) => {
      if (document.uri.scheme === "doppler" && document.languageId !== "yaml") {
        await vscode.languages.setTextDocumentLanguage(document, "yaml");
      }
    });
  }

  async open_config_dashboard() {
    const document = vscode.window.activeTextEditor?.document;

    if (document !== undefined) {
      const { project, config } = await helpers.parser.fromURI(document.uri);
      const { id: workplace } = await doppler.workplace.fetch();
      const dashboardhost = await doppler.auth.dashboardHost();

      vscode.env.openExternal(
        vscode.Uri.parse(
          `${dashboardhost}/workplace/${workplace}/projects/${project}/configs/${config}`
        )
      );
    }
  }
}

export default function (context: vscode.ExtensionContext) {
  return new DopplerExplorer(context);
}

const vscode = require("vscode");
const helpers = require("../helpers");
const doppler = require("../doppler");
const DopplerEditorProvider = require("./editor_provider");

class DopplerExplorer {
  constructor(context) {
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

      vscode.env.openExternal(
        `https://dashboard.doppler.com/workplace/${workplace}/projects/${project}/configs/${config}`
      );
    }
  }
}

module.exports = function (context) {
  return new DopplerExplorer(context);
};

import { window, workspace, languages, Uri, env, commands, ExtensionContext } from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";
import DopplerEditorProvider from "./editor_provider";

class DopplerExplorer {
  constructor(context: ExtensionContext) {
    const treeDataProvider = new DopplerEditorProvider(context);

    window.createTreeView("doppler-explorer", {
      treeDataProvider: treeDataProvider,
    });

    context.subscriptions.push(workspace.registerTextDocumentContentProvider("doppler", treeDataProvider));

    context.subscriptions.push(
      commands.registerCommand(`doppler.explorer.editor.config.dashboard`, () => {
        this.open_config_dashboard();
      })
    );

    workspace.onDidOpenTextDocument(async (document) => {
      if (document.uri.scheme === "doppler" && document.languageId !== "yaml") {
        await languages.setTextDocumentLanguage(document, "yaml");
      }
    });
  }

  async open_config_dashboard() {
    const document = window.activeTextEditor?.document;

    if (document !== undefined) {
      const { project, config } = await helpers.parser.fromURI(document.uri);
      const { id: workplace } = await doppler.workplace.fetch();
      const dashboardhost = await doppler.auth.dashboardHost();

      env.openExternal(Uri.parse(`${dashboardhost}/workplace/${workplace}/projects/${project}/configs/${config}`));
    }
  }
}

export default function (context: ExtensionContext) {
  return new DopplerExplorer(context);
}

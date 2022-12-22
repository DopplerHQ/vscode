import * as vscode from "vscode";
import * as doppler from "../doppler";
import DopplerFileSystemProvider from "./file_system_provider";

enum EntryType {
  Project,
  Environment,
  Config,
}

interface Entry {
  uri: vscode.Uri;
  type: EntryType;
  isDirectory: boolean;
  project: string | null;
  environment: string | null;
  config: string | null;
}

export default class DopplerEditorProvider implements vscode.TreeDataProvider<Entry>, vscode.TextDocumentContentProvider {
  private basePath: string;
  private fileSystemProvider: DopplerFileSystemProvider;

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  constructor(context: vscode.ExtensionContext) {
    this.basePath = "doppler://";
    this.fileSystemProvider = new DopplerFileSystemProvider();

    context.subscriptions.push(
      vscode.workspace.registerFileSystemProvider("doppler", this.fileSystemProvider, { isCaseSensitive: true })
    );

    vscode.commands.registerCommand("doppler.explorer.refresh", () => {
      this._onDidChangeTreeData.fire(undefined);
    });
  }

  // Required part of the TextDocumentContentProvider interface
  readonly onDidChange?: vscode.Event<vscode.Uri> | undefined;
  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    throw new Error("Method not implemented.");
  }

  getTreeItem(element: Entry) {
    const icons = {
      [EntryType.Project]: "repo",
      [EntryType.Environment]: "versions",
      [EntryType.Config]: "symbol-field",
    };

    return {
      iconPath: new vscode.ThemeIcon(icons[element.type]),
      resourceUri: element.uri,
      collapsibleState: element.isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : undefined,
      command: element.isDirectory
        ? undefined
        : {
            command: "vscode.open",
            arguments: [element.uri],
            title: "Edit Secrets",
          },
    };
  }

  async getChildren(element: Entry): Promise<Entry[]> {
    if (!(await doppler.auth.hasDopplerCLI())) {
      return [];
    }

    if (!(await doppler.auth.isAuthenticated())) {
      return [];
    }

    // List Projects
    if (element === undefined) {
      const projects = await doppler.projects.fetch();
      return projects.map((project) => {
        return {
          uri: vscode.Uri.parse(`${this.basePath}/${project.name}`),
          isDirectory: true,
          type: EntryType.Project,
          project: project.name,
          environment: null,
          config: null,
        };
      });

      // List Environments
    } else if (element.environment === null) {
      const project_name = element.project as string;
      const environments = await doppler.environments.fetch(project_name);
      return environments.map((environment) => {
        return {
          uri: vscode.Uri.parse(`${element.uri}/${environment.id}`),
          isDirectory: true,
          type: EntryType.Environment,
          project: project_name,
          environment: environment.id,
          config: null,
        };
      });

      // List Configs
    } else {
      const project_name = element.project as string;
      const environment_id = element.environment as string;
      const configs = await doppler.configs.fetch(project_name, environment_id);

      return configs.map((config) => {
        return {
          uri: vscode.Uri.parse(`${element.uri}/${config.name}`),
          isDirectory: false,
          type: EntryType.Config,
          project: project_name,
          environment: environment_id,
          config: config.name,
        };
      });
    }
  }
}

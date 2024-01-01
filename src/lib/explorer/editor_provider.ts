import {
  workspace,
  commands,
  Uri,
  TreeDataProvider,
  TextDocumentContentProvider,
  EventEmitter,
  Event,
  ExtensionContext,
  CancellationToken,
  ProviderResult,
  TreeItemCollapsibleState,
  ThemeIcon,
  window
} from "vscode";
import * as doppler from "../doppler";
import DopplerFileSystemProvider from "./file_system_provider";

enum EntryType {
  Project,
  Environment,
  Config,
}

interface Entry {
  uri: Uri;
  type: EntryType;
  isDirectory: boolean;
  project: string | null;
  environment: string | null;
  config: string | null;
}

export default class DopplerEditorProvider implements TreeDataProvider<Entry>, TextDocumentContentProvider {
  private basePath: string;
  private fileSystemProvider: DopplerFileSystemProvider;

  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  constructor(context: ExtensionContext) {
    this.basePath = "doppler://";
    this.fileSystemProvider = new DopplerFileSystemProvider();

    context.subscriptions.push(
      workspace.registerFileSystemProvider("doppler", this.fileSystemProvider, { isCaseSensitive: true })
    );

    commands.registerCommand("doppler.explorer.refresh", () => {
      this._onDidChangeTreeData.fire(undefined);
    });

    commands.registerCommand('doppler.explorer.addProject', async () => {
      const input = await window.showInputBox({
          placeHolder: 'Project_Name',
          prompt: 'Enter name of project',
      });
      if (input) {
          await doppler.projects.add(input);
          window.showInformationMessage(`Successfully added ${input}`);
          await commands.executeCommand("doppler.explorer.refresh");
      }
    });

    commands.registerCommand(
        'doppler.addEnvironment',
        async (args: any) => {
            const project = args.project;
            const input = await window.showInputBox({
                placeHolder: 'Environment_Name',
                prompt: 'Enter name of environment (no special characters or spaces)',
            });
            if (input) {
                await doppler
                    .environments.add(project, input);
                window.showInformationMessage(
                    `Successfully added ${input} to ${project}`
                );
                await commands.executeCommand("doppler.explorer.refresh");
            }
        }
    );
    commands.registerCommand(
        'doppler.addConfig',
        async (args: any) => {
          const environment = args.environment;
          const project = args.project;
          const input = await window.showInputBox({
              placeHolder: 'Config_Name',
              prompt: 'Enter name of config',
          });
          if (input) {
              await doppler
                  .configs.add(
                      project,
                      environment,
                      input
                  );
              window.showInformationMessage(
                  `Successfully added ${input} to ${environment} in ${project}`
              );
              await commands.executeCommand("doppler.explorer.refresh");
          }
        }
    );
  }

  // Required part of the TextDocumentContentProvider interface
  readonly onDidChange?: Event<Uri> | undefined;
  provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
    throw new Error("Method not implemented.");
  }

  getTreeItem(element: Entry) {
    const icons = {
      [EntryType.Project]: "repo",
      [EntryType.Environment]: "versions",
      [EntryType.Config]: "symbol-field",
    };

    return {
      contextValue: element.type.toString(),
      iconPath: new ThemeIcon(icons[element.type]),
      resourceUri: element.uri,
      collapsibleState: element.isDirectory ? TreeItemCollapsibleState.Collapsed : undefined,
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
          uri: Uri.parse(`${this.basePath}/${project.name}`),
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
          uri: Uri.parse(`${element.uri}/${environment.id}`),
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
          uri: Uri.parse(`${element.uri}/${config.name}`),
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

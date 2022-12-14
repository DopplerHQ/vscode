const vscode = require("vscode");
const doppler = require("../doppler");
const DopplerFileSystemProvider = require("./file_system_provider");

class DopplerEditorProvider {
  constructor(context) {
    const changeEventEmitter = new vscode.EventEmitter();
    this.onDidChangeTreeData = changeEventEmitter.event;
    this.basePath = "doppler://";
    this.fileSystemProvider = new DopplerFileSystemProvider();

    context.subscriptions.push(
      vscode.workspace.registerFileSystemProvider(
        "doppler",
        this.fileSystemProvider,
        { isCaseSensitive: true }
      )
    );

    vscode.commands.registerCommand("doppler.explorer.refresh", () => {
      changeEventEmitter.fire();
    });
  }

  getTreeItem(element) {
    const icons = {
      project: "repo",
      environment: "versions",
      config: "symbol-field",
    };

    return {
      iconPath: new vscode.ThemeIcon(icons[element.type]),
      resourceUri: element.resource,
      collapsibleState: element.isDirectory
        ? vscode.TreeItemCollapsibleState.Collapsed
        : undefined,
      command: element.isDirectory
        ? undefined
        : {
            command: "vscode.open",
            arguments: [element.resource],
            title: "Edit Secrets",
          },
    };
  }

  async getChildren(element) {
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
          resource: vscode.Uri.parse(`${this.basePath}/${project.name}`),
          isDirectory: true,
          type: "project",
          project: project.name,
          environment: null,
          config: null,
        };
      });

      // List Environments
    } else if (element.environment === null) {
      const project_name = element.project;
      const environments = await doppler.environments.fetch(project_name);
      return environments.map((environment) => {
        const resource = vscode.Uri.parse(
          `${element.resource}/${environment.id}`
        );

        return {
          resource: resource,
          isDirectory: true,
          type: "environment",
          project: project_name,
          environment: environment.id,
          config: null,
        };
      });

      // List Configs
    } else {
      const project_name = element.project;
      const environment_id = element.environment;
      const configs = await doppler.configs.fetch(project_name);

      return configs
        .filter((config) => {
          return config.name.includes(environment_id);
        })
        .map((config) => {
          const resource = vscode.Uri.parse(
            `${element.resource}/${config.name}`
          );

          return {
            resource: resource,
            isDirectory: false,
            type: "config",
            project: project_name,
            environment: environment_id,
            config: config.name,
          };
        });
    }
  }
}

module.exports = DopplerEditorProvider;

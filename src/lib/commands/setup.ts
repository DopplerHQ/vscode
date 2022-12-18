import * as vscode from "vscode";
import * as helpers from "../helpers";
import * as doppler from "../doppler";
import install, { InstallFailedError } from "./install";
import login from "./login";

const QUICK_PICK_OPTIONS = {
  canPickMany: false,
  ignoreFocusOut: true,
};

type DopplerQuickPickStringItem = {
  label: string;
  description?: string;
  target: string;
};

type DopplerQuickPickBooleanItem = {
  label: string;
  description?: string;
  target: boolean;
};

async function select_project() {
  const current_project = await doppler.auth.project();
  const projects = await doppler.projects.fetch();
  const items: DopplerQuickPickStringItem[] = projects.map((project) => {
    return {
      label: project.name,
      description: current_project == project.id ? "(current)" : undefined,
      target: project.id,
    };
  });

  const response = await vscode.window.showQuickPick(items, {
    title: "Select Project",
    ...QUICK_PICK_OPTIONS,
  });

  return response?.target || "";
}

async function select_config(project: string) {
  const current_config = await doppler.auth.config();
  const configs = await doppler.configs.fetch(project);
  const items: DopplerQuickPickStringItem[] = configs.map((config) => {
    return {
      label: config.name,
      description: current_config == config.name ? "(current)" : undefined,
      target: config.name,
    };
  });
  const response = await vscode.window.showQuickPick(items, {
    title: "Select Config",
    ...QUICK_PICK_OPTIONS,
  });

  return response?.target || "";
}

async function select_autocomplete() {
  const items: DopplerQuickPickBooleanItem[] = [
    {
      label: "Enable",
      description: "Show my secrets when typing an environment variable",
      target: true,
    },
    {
      label: "Disable",
      target: false,
    },
  ];

  const response = await vscode.window.showQuickPick(items, {
    title: "Environment Variable: Autocomplete",
    ...QUICK_PICK_OPTIONS,
  });

  return response?.target || false;
}

async function select_hover() {
  const items: DopplerQuickPickBooleanItem[] = [
    {
      label: "Enable",
      description: "Show my secret when hovering over an environment variable",
      target: true,
    },
    {
      label: "Disable",
      target: false,
    },
  ];
  const response = await vscode.window.showQuickPick(items, {
    title: "Environment Variable: Hover",
    ...QUICK_PICK_OPTIONS,
  });

  return response?.target || false;
}

export default async function () {
  if (!(await doppler.auth.hasDopplerCLI())) {
    try {
      await install();
    } catch (error) {
      if (error instanceof InstallFailedError) {
        // Return as we direct the user to our docs
        // when the install fails.
        return;
      }

      throw error;
    }
  }

  if (!(await doppler.auth.isAuthenticated())) {
    await login();
  }

  const configuration = vscode.workspace.getConfiguration("doppler");
  const target = vscode.ConfigurationTarget.Workspace;

  // Setup Doppler CLI with scope
  const project = await select_project();
  const config = await select_config(project);
  await helpers.terminal.run(
    `doppler setup --project=${project} --config=${config}`
  );

  // Configure Autocomplete
  const autocomplete = await select_autocomplete();
  configuration.update("autocomplete.enable", autocomplete, target);

  // Configure Hover
  const hover = await select_hover();
  configuration.update("hover.enable", hover, target);

  // Show results
  vscode.window.showInformationMessage(
    `Doppler has been configured for ${project}.${config}`
  );
  await vscode.commands.executeCommand("doppler.explorer.refresh");
}

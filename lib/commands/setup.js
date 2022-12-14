const vscode = require("vscode");
const helpers = require("../helpers");
const doppler = require("../doppler");

const QUICK_PICK_OPTIONS = {
  canPickMany: false,
  ignoreFocusOut: true,
};

async function select_project() {
  const current_project = await doppler.auth.project();
  const projects = await doppler.projects.fetch();
  const response = await vscode.window.showQuickPick(
    projects.map((project) => {
      return {
        label: project.name,
        description: current_project == project.id ? "(current)" : null,
        target: project.id,
      };
    }),
    { title: "Select Project", ...QUICK_PICK_OPTIONS }
  );

  return response.target;
}

async function select_config(project) {
  const current_config = await doppler.auth.config();
  const configs = await doppler.configs.fetch(project);
  const response = await vscode.window.showQuickPick(
    configs.map((config) => {
      return {
        label: config.name,
        description: current_config == config.name ? "(current)" : null,
        target: config.name,
      };
    }),
    { title: "Select Config", ...QUICK_PICK_OPTIONS }
  );

  return response.target;
}

module.exports = async function () {
  if (!(await doppler.auth.isAuthenticated())) {
    await this.login();
  }

  // Setup Doppler CLI with scope
  const project = await select_project();
  const config = await select_config(project);
  await helpers.terminal.run(
    `doppler setup --project=${project} --config=${config}`
  );

  // Show results
  vscode.window.showInformationMessage(
    `Doppler has been configured for ${project}.${config}`
  );
};

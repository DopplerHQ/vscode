const vscode = require("vscode");
const util = require("node:util");
const { exec } = require("child_process");
const execAsync = util.promisify(exec);

class DopplerTerminalError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "DopplerTerminalError";
  }
}

class DopplerTerminal {
  constructor() {
    this.workingDirectory =
      vscode.workspace.workspaceFolders[0]?.uri.path || "/";
  }

  async exists(command) {
    try {
      const path = await this.run(`which ${command} || true`);
      return path.length > 0;
    } catch (error) {
      return false;
    }
  }

  async run(command, options = {}) {
    options.cwd = this.workingDirectory();

    const { stdout, stderr } = await execAsync(command, options);

    if (stderr.length > 0) {
      throw new DopplerTerminalError(stderr);
    }

    return stdout.trim();
  }

  async prompt(command) {
    let terminal = vscode.window.activeTerminal;

    if (terminal === undefined) {
      terminal = vscode.window.createTerminal("Doppler");
      terminal.sendText(`cd ${this.workingDirectory}; clear;`);
    }

    terminal.sendText(command);
    terminal.show();
  }
}

module.exports = DopplerTerminal;

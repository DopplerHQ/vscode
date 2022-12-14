const vscode = require("vscode");
const util = require("node:util");
const path = require("path");
const { exec } = require("child_process");
const execAsync = util.promisify(exec);

class DopplerTerminalError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "DopplerTerminalError";
  }
}

class DopplerTerminal {
  workingDirectory() {
    // Use the root if there aren't any active workspace directories
    if (vscode.workspace.workspaceFolders === undefined) {
      return "/";
    }

    // If an editor is active, select the corresponding workspace directory
    if (vscode.window.activeTextEditor !== undefined) {
      const activeEditorPath = vscode.window.activeTextEditor.document.uri.path;

      return vscode.workspace.workspaceFolders?.find((folder) => {
        const relative = path.relative(folder.uri.fsPath, activeEditorPath);
        return (
          relative && !relative.startsWith("..") && !path.isAbsolute(relative)
        );
      });
    }

    // Default to the first workspace directory
    return vscode.workspace.workspaceFolders[0].uri.path;
  }

  async exists(command) {
    const path = await this.run(`which ${command} || true`);
    return path.length > 0;
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
      terminal.sendText(`cd ${this.workingDirectory()}; clear;`);
    }

    terminal.sendText(command);
    terminal.show();
  }
}

module.exports = DopplerTerminal;

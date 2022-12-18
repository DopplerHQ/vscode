import * as vscode from "vscode";
import * as util from "util";
import * as path from "path";
import { exec } from "child_process";

const execAsync = util.promisify(exec);

class DopplerTerminalError extends Error {
  constructor(...args: any[]) {
    super(...args);
    this.name = "DopplerTerminalError";
  }
}

export default class DopplerTerminal {
  public workingDirectory(): string {
    // Use the root if there aren't any active workspace directories
    if (vscode.workspace.workspaceFolders === undefined) {
      return "/";
    }

    // If an editor is active, select the corresponding workspace directory
    if (vscode.window.activeTextEditor !== undefined) {
      const activeEditorPath = vscode.window.activeTextEditor.document.uri.path;
      const matchedPath = vscode.workspace.workspaceFolders?.find((folder) => {
        const relative = path.relative(folder.uri.fsPath, activeEditorPath);
        return (
          relative && !relative.startsWith("..") && !path.isAbsolute(relative)
        );
      });

      if (matchedPath !== undefined) {
        return matchedPath.uri.path;
      }
    }

    // Default to the first workspace directory
    return vscode.workspace.workspaceFolders[0].uri.path;
  }

  public async exists(command: string): Promise<boolean> {
    const path = await this.run(`which ${command} || true`);
    return path.length > 0;
  }

  public async run(command: string, options: any = {}): Promise<string> {
    options.cwd = this.workingDirectory();

    const { stdout, stderr } = await execAsync(command, options);

    if (stderr.length > 0) {
      throw new DopplerTerminalError(stderr.toString());
    }

    return stdout.toString().trim();
  }

  public async prompt(command: string) {
    let terminal = vscode.window.activeTerminal;

    if (terminal === undefined) {
      terminal = vscode.window.createTerminal("Doppler");
      terminal.sendText(`cd ${this.workingDirectory()}; clear;`);
    }

    terminal.sendText(command);
    terminal.show();
  }
}

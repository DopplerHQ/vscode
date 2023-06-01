import { window, workspace } from "vscode";
import * as util from "util";
import * as path from "path";
import { spawn } from "child_process";
import commandExists from "command-exists";
import { isWindows } from "./os";

const commandExistsAsync = util.promisify(commandExists);

export class SpawnError extends Error {
  public code: number | null;
  public stdout: string;
  public stderr: string;

  constructor(message: string, code: number | null, stdout: string, stderr: string) {
    super(message);
    this.code = code;
    this.stdout = stdout;
    this.stderr = stderr;
  }

  toString() {
    return [`SpawnError: ${this.message}`, `exit=${this.code}`, this.stderr].join("\n");
  }
}

export default class DopplerTerminal {
  private outputChannel = window.createOutputChannel(`Doppler`);

  public workingDirectory(): string {
    // Use the root if there aren't any active workspace directories
    if (workspace.workspaceFolders === undefined) {
      return "/";
    }

    // Default to the first workspace directory
    let fsPath = workspace.workspaceFolders[0].uri.fsPath;

    // If an editor is active, select the corresponding workspace directory
    if (window.activeTextEditor !== undefined) {
      const activeEditorPath = window.activeTextEditor.document.uri.fsPath;
      const matchedPath = workspace.workspaceFolders?.find((folder) => {
        const relative = path.relative(folder.uri.fsPath, activeEditorPath);
        return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
      });

      if (matchedPath !== undefined) {
        fsPath = matchedPath.uri.fsPath;
      }
    }

    // If we're running on Windows, ensure the drive letter is capitalized. By
    // default it comes back as lowercase even though it's uppercase in the
    // command prompt. Since the Doppler CLI is case-sensitive, this break things.
    if (isWindows() && path.isAbsolute(fsPath)) {
      return fsPath.charAt(0).toUpperCase() + fsPath.slice(1);
    }

    return fsPath;
  }

  public async exists(command: string): Promise<boolean> {
    return await commandExistsAsync(command);
  }

  public async run(command: string, args: string[], options: any = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      const process = spawn(command, args, {
        ...options,

        // If the shell option is enabled, any input containing shell metacharacters may be used to trigger arbitrary command execution.
        // We explicitly disable this, in case any caller attempts to enable it.
        shell: false,

        // Set current working directory to vscode active workspace directory
        cwd: this.workingDirectory(),
      });

      process.stdout.on("data", (data) => {
        stdout += data;
      });

      process.stderr.on("data", (data) => {
        stderr += data;
      });

      process.on("close", (code) => {
        stdout = stdout.trim();
        stderr = stderr.trim();

        if (code === 0) {
          if (stderr.length > 0) {
            this.outputChannel.append(stderr);
            this.outputChannel.show();
          }

          resolve(stdout);
        } else {
          reject(new SpawnError(`Command failed: ${command} ${JSON.stringify(args)}`, code, stdout, stderr));
        }
      });
    });
  }

  public async prompt(command: string) {
    let terminal = window.activeTerminal;

    if (terminal === undefined) {
      terminal = window.createTerminal("Doppler");
      terminal.sendText(`cd ${this.workingDirectory()}; clear;`);
    }

    terminal.sendText(command);
    terminal.show();
  }
}

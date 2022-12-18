import * as vscode from "vscode";

export default class DopplerParser {
  public fromReference(reference: string, uri: vscode.Uri) {
    const uriIDs = this.fromURI(uri);
    const parts = reference.split(".");

    switch (parts.length) {
      case 1:
        return {
          project: uriIDs.project,
          config: uriIDs.config,
          secret: parts[0],
        };

      case 2:
        return { project: uriIDs.project, config: parts[0], secret: parts[1] };

      default:
        return { project: parts[0], config: parts[1], secret: parts[2] };
    }
  }

  public fromURI(uri: vscode.Uri) {
    const parts = uri.path.slice(1).split("/");

    return {
      project: parts[0],
      config: parts[2],
    };
  }
}

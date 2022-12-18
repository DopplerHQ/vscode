import * as vscode from "vscode";

export default async function () {
  vscode.env.openExternal(vscode.Uri.parse("https://docs.doppler.com"));
}

import { env, Uri } from "vscode";

export default async function () {
  env.openExternal(Uri.parse("https://docs.doppler.com"));
}

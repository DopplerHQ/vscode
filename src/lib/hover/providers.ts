import * as vscode from "vscode";
import * as yaml from "yaml";
import * as doppler from "../doppler";
import * as helpers from "../helpers";

async function hover(
  language: string,
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const configuration = vscode.workspace.getConfiguration("doppler");

  if (!configuration.get("hover.enable")) {
    return null;
  }

  if (!(await doppler.auth.hasDopplerCLI())) {
    return null;
  }

  if (!(await doppler.auth.isAuthenticated())) {
    return null;
  }

  if (!(await doppler.auth.isScopeConfigured())) {
    return null;
  }

  const project = await doppler.auth.project();
  const config = await doppler.auth.config();
  const regexDict: { [key: string]: RegExp } = {
    javascript:
      /(?:process\.env\.([A-Z][A-Z_0-9]+))|(?:process\.env\[["'`]([A-Z][A-Z_0-9]+)["'`]\])/g,
    ruby: /ENV\[['"]([A-Z][A-Z_0-9]+)['"]\]/g,
    python:
      /os\.(?:(?:environ(?:(?:\.get\(["']([A-Z][A-Z_0-9]+)["']\))|(?:\[["']([A-Z][A-Z_0-9]+)["']\])))|(?:getenv\(["']([A-Z][A-Z_0-9]+)["']\)))/g,
    php: /(?:(?:\$_(?:SERVER|ENV)\[["']([A-Z][A-Z_0-9]+)["']\])|(?:getenv\(["']([A-Z][A-Z_0-9]+)["']\)))/g,
    go: /os.Getenv\(["']([A-Z][A-Z_0-9]+)["']\)/g,
    java: /dotenv.get\(["']([A-Z][A-Z_0-9]+)["']\)/g,
    csharp: /Environment.GetEnvironmentVariable\(["']([A-Z][A-Z_0-9]+)["']\)/g,
    rust: /std::env::(?:var|var_os)\(["']([A-Z][A-Z_0-9]+)["']\)/g,
    doppler_yaml: /\${([A-Za-z][\w.]+)}/g,
  };

  const reg = regexDict[language];

  if (reg == undefined) {
    return;
  }

  const line = document.lineAt(position).text;
  const matches = line.matchAll(reg);

  for (const match of matches) {
    const key = [...match].slice(1).find((element) => element !== undefined);

    if (key === undefined) {
      continue;
    }

    const start = line.indexOf(key);
    const end = start + key.length;
    let value;

    if (language === "doppler_yaml") {
      // Referencing secret in another config
      if (key.includes(".")) {
        const { project, config, secret } = helpers.parser.fromReference(
          key,
          document.uri
        );
        value = await doppler.secrets.fetchSecret(project, config, secret);

        // Referencing secret in current document
      } else {
        const local_secrets = yaml.parse(document.getText());
        value = local_secrets[key];
      }
    } else {
      value = await doppler.secrets.fetchSecret(project, config, key);
    }

    if (
      position.character >= start &&
      position.character <= end &&
      value !== undefined
    ) {
      const text = [
        "**Doppler**",
        `Project: ${project}`,
        `Config: ${config}`,
        `${key}: "${value}"`,
      ].join("</br>");
      const markdown = new vscode.MarkdownString(text);
      markdown.supportHtml = true;
      return new vscode.Hover(markdown);
    }
  }
}

export const providers: { [key: string]: vscode.HoverProvider } = {
  javascript: {
    provideHover: function (document, position) {
      return hover("javascript", document, position);
    },
  },
  ruby: {
    provideHover: function (document, position) {
      return hover("ruby", document, position);
    },
  },
  python: {
    provideHover: function (document, position) {
      return hover("python", document, position);
    },
  },
  php: {
    provideHover: function (document, position) {
      return hover("php", document, position);
    },
  },
  go: {
    provideHover: function (document, position) {
      return hover("go", document, position);
    },
  },
  java: {
    provideHover: function (document, position) {
      return hover("java", document, position);
    },
  },
  csharp: {
    provideHover: function (document, position) {
      return hover("csharp", document, position);
    },
  },
  rust: {
    provideHover: function (document, position) {
      return hover("rust", document, position);
    },
  },
  doppler: {
    provideHover: function (document, position) {
      return hover("doppler_yaml", document, position);
    },
  },
};

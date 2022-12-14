const vscode = require("vscode");
const yaml = require("yaml");
const doppler = require("../doppler");
const helpers = require("../helpers");

async function hover(language, document, position) {
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

  const secrets = await doppler.secrets.fetchFromScope();
  const regexDict = {
    javascript:
      /(?:process\.env\.([A-Z][A-Z_0123456789]+))|(?:process\.env\[["'`]([A-Z][A-Z_0123456789]+)["'`]\])/g,
    ruby: /ENV\[['"]([A-Z][A-Z_0123456789]+)['"]\]/g,
    python:
      /os\.(?:(?:environ(?:(?:\.get\(["']([A-Z][A-Z_0123456789]+)["']\))|(?:\[["']([A-Z][A-Z_0123456789]+)["']\])))|(?:getenv\(["']([A-Z][A-Z_0123456789]+)["']\)))/g,
    php: /(?:(?:\$_(?:SERVER|ENV)\[["']([A-Z][A-Z_0123456789]+)["']\])|(?:getenv\(["']([A-Z][A-Z_0123456789]+)["']\)))/g,
    go: /os.Getenv\(["']([A-Z][A-Z_0123456789]+)["']\)/g,
    java: /dotenv.get\(["']([A-Z][A-Z_0123456789]+)["']\)/g,
    csharp:
      /Environment.GetEnvironmentVariable\(["']([A-Z][A-Z_0123456789]+)["']\)/g,
    rust: /std::env::(?:var|var_os)\(["']([A-Z][A-Z_0123456789]+)["']\)/g,
    doppler_yaml: /\${([A-Za-z][\w.]+)}/g,
  };

  const reg = regexDict[language];
  const line = document.lineAt(position).text;
  const matches = line.matchAll(reg);

  for (const match of matches) {
    const key = [...match].slice(1).find((element) => element !== undefined);
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
      value = secrets[key];
    }

    if (
      position.character >= start &&
      position.character <= end &&
      value !== undefined
    ) {
      const text = [
        "**Doppler**",
        `Project: ${secrets.DOPPLER_PROJECT}`,
        `Config: ${secrets.DOPPLER_CONFIG}`,
        `${key}: "${value}"`,
      ].join("</br>");
      const markdown = new vscode.MarkdownString(text);
      markdown.supportHtml = true;
      return new vscode.Hover(markdown);
    }
  }
}

module.exports.javascript = {
  provideHover: function (document, position) {
    return hover("javascript", document, position);
  },
};

module.exports.ruby = {
  provideHover: function (document, position) {
    return hover("ruby", document, position);
  },
};

module.exports.python = {
  provideHover: function (document, position) {
    return hover("python", document, position);
  },
};

module.exports.php = {
  provideHover: function (document, position) {
    return hover("php", document, position);
  },
};

module.exports.go = {
  provideHover: function (document, position) {
    return hover("go", document, position);
  },
};

module.exports.java = {
  provideHover: function (document, position) {
    return hover("java", document, position);
  },
};

module.exports.csharp = {
  provideHover: function (document, position) {
    return hover("csharp", document, position);
  },
};

module.exports.rust = {
  provideHover: function (document, position) {
    return hover("rust", document, position);
  },
};

module.exports.doppler = {
  provideHover: function (document, position) {
    return hover("doppler_yaml", document, position);
  },
};

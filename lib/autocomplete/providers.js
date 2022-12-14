const vscode = require("vscode");
const doppler = require("../doppler");

async function autocomplete(triggerCharacter, position) {
  const configuration = vscode.workspace.getConfiguration("doppler");

  if (!configuration.get("autocomplete.enable")) {
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
  const secret_names = await doppler.secrets.fetchNames(project, config);
  const ignoreTriggers = ["'", "`", '"', "."];
  const quote = ignoreTriggers.includes(triggerCharacter) ? "" : '"'; // for javascript, doesn't use quotation in env reference so make sure not to add to insert/filter text
  const lines = [];

  for (const key of secret_names) {
    const completionItemLabel = {
      label: key,
      detail: ` Doppler: ${project}.${config}.${key}`,
    };

    const item = new vscode.CompletionItem(
      completionItemLabel,
      vscode.CompletionItemKind.Variable
    );
    item.insertText = `${triggerCharacter}${quote}${key}${quote}`;
    item.filterText = `${triggerCharacter}${quote}${key}${quote}`;
    item.range = new vscode.Range(
      new vscode.Position(position.line, position.character - 1),
      position
    ); // Picks up trigger character as prefix to fix the scoring it does when sorting
    item.sortText = `0-${project}.${config}.${key}`; // Make this the sortText so that any secret will go to the top of the list above anything else. After that VS Code will sort alphabetically by the label name.
    lines.push(item);
  }

  return lines;
}

module.exports.javascript = {
  triggerCharacters: ["'", "`", '"', "[", "."],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.endsWith("process.env.")) {
      return autocomplete(".", position);
    }

    if (linePrefix.match(/.*?process\.env\[(["'`])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.ruby = {
  triggerCharacters: ["'", '"', "["],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.match(/.*?ENV\[(["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.python = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (
      linePrefix.match(/.*?os\.environ.get\((["'])?/) ||
      linePrefix.match(/.*?os\.getenv\((["'])?/)
    ) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.pythonArray = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.match(/.*?os\.environ\[(["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.php = {
  triggerCharacters: ["'", '"', "["],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (
      linePrefix.match(/.*?\$_SERVER\[(["'])?/) ||
      linePrefix.match(/.*?\$_ENV\[(["'])?/)
    ) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.phpGetEnv = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.match(/.*?getenv\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.go = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.match(/.*?os\.Getenv\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.java = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.match(/.*?dotenv\.get\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.csharp = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (linePrefix.match(/.*?Environment\.GetEnvironmentVariable\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

module.exports.rust = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    if (
      linePrefix.match(/.*?std::env::var\((["'])?/) ||
      linePrefix.match(/.*?std::env::var_os\((["'])?/)
    ) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

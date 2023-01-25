import { workspace, Position, CompletionItem, CompletionItemKind, CompletionItemProvider, Range } from "vscode";
import * as doppler from "../doppler";

async function autocomplete(triggerCharacter: string, position: Position) {
  const configuration = workspace.getConfiguration("doppler");

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

    const item = new CompletionItem(completionItemLabel, CompletionItemKind.Variable);
    item.insertText = `${triggerCharacter}${quote}${key}${quote}`;
    item.filterText = `${triggerCharacter}${quote}${key}${quote}`;
    item.range = new Range(new Position(position.line, position.character - 1), position); // Picks up trigger character as prefix to fix the scoring it does when sorting
    item.sortText = `0-${project}.${config}.${key}`; // Make this the sortText so that any secret will go to the top of the list above anything else. After that VS Code will sort alphabetically by the label name.
    lines.push(item);
  }

  return lines;
}

export interface DopplerCompletionItemProvider extends CompletionItemProvider {
  triggerCharacters: string[];
}

export const javascript: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", "`", '"', "[", "."],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.endsWith("process.env.")) {
      return autocomplete(".", position);
    }

    if (linePrefix.match(/.*?process\.env\[(["'`])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const ruby: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "["],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?ENV\[(["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const python: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?os\.environ.get\((["'])?/) || linePrefix.match(/.*?os\.getenv\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const pythonArray: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?os\.environ\[(["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const php: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "["],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?\$_SERVER\[(["'])?/) || linePrefix.match(/.*?\$_ENV\[(["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const phpGetEnv: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?getenv\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const go: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?os\.Getenv\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const java: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?dotenv\.get\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const csharp: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?Environment\.GetEnvironmentVariable\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

export const rust: DopplerCompletionItemProvider = {
  triggerCharacters: ["'", '"', "("],
  provideCompletionItems: function (document, position) {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);

    if (linePrefix.match(/.*?std::env::var\((["'])?/) || linePrefix.match(/.*?std::env::var_os\((["'])?/)) {
      return autocomplete(linePrefix.slice(-1), position);
    }

    return undefined;
  },
};

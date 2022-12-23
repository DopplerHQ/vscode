import { languages, ExtensionContext } from "vscode";
import * as providers from "./providers";

export default function (context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "javascript" },
      providers.javascript,
      ...providers.javascript.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "typescript" },
      providers.javascript,
      ...providers.javascript.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "javascriptreact" },
      providers.javascript,
      ...providers.javascript.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "typescriptreact" },
      providers.javascript,
      ...providers.javascript.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "vue" },
      providers.javascript,
      ...providers.javascript.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "ruby" },
      providers.ruby,
      ...providers.ruby.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "python" },
      providers.python,
      ...providers.python.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "python" },
      providers.pythonArray,
      ...providers.python.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "php" },
      providers.php,
      ...providers.php.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "php" },
      providers.phpGetEnv,
      ...providers.phpGetEnv.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider({ scheme: "file", language: "go" }, providers.go, ...providers.go.triggerCharacters)
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "java" },
      providers.java,
      ...providers.java.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "csharp" },
      providers.csharp,
      ...providers.csharp.triggerCharacters
    )
  );

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { scheme: "file", language: "rust" },
      providers.rust,
      ...providers.rust.triggerCharacters
    )
  );
}

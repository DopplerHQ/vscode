const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const assert = require("assert");
const path = require("path");
const vscode = require("vscode");

const providers = require("../../../lib/autocomplete/providers");

describe("autcomplete providers", function () {
  describe("#javascriptCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const javascriptFile = path.join(
        __dirname,
        "..",
        "examples",
        "javascript.js"
      );
      const document = await vscode.workspace.openTextDocument(javascriptFile);
      const position = new vscode.Position(1, 22);

      const result = providers.javascript.provideCompletionItems(
        document,
        position
      );

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const javascriptFile = path.join(
        __dirname,
        "..",
        "examples",
        "javascript.js"
      );
      const document = await vscode.workspace.openTextDocument(javascriptFile);
      const position = new vscode.Position(1, 24);

      const result = providers.javascript.provideCompletionItems(
        document,
        position
      );

      assert.equal(result[0].insertText, ".HELLO");
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#rubyCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const rubyFile = path.join(__dirname, "..", "examples", "ruby.rb");
      const document = await vscode.workspace.openTextDocument(rubyFile);
      const position = new vscode.Position(1, 7);

      const result = providers.ruby.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const rubyFile = path.join(__dirname, "..", "examples", "ruby.rb");
      const document = await vscode.workspace.openTextDocument(rubyFile);
      const position = new vscode.Position(1, 9);

      const result = providers.ruby.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '["HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#pythonCompletion", function () {
    it("returns undefined at line 0 and wrong position for os.environ.get format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(3, 19);

      const result = providers.python.provideCompletionItems(
        document,
        position
      );

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for os.environ.get format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(3, 21);

      const result = providers.python.provideCompletionItems(
        document,
        position
      );

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });

    it("returns undefined at line 0 and wrong position for os.getenv format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(4, 13);

      const result = providers.python.provideCompletionItems(
        document,
        position
      );

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for os.getenv format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(4, 16);

      const result = providers.python.provideCompletionItems(
        document,
        position
      );

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });

    it("returns undefined at line 0 and wrong position for os.environ[] format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(5, 15);

      const result = providers.pythonArray.provideCompletionItems(
        document,
        position
      );

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for os.environ[] format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(5, 17);

      const result = providers.pythonArray.provideCompletionItems(
        document,
        position
      );

      assert.equal(result[0].insertText, '["HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#phpCompletion", function () {
    it("returns undefined at line 0 and wrong position for $_ENV[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(3, 15);

      const result = providers.php.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for $_ENV[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(3, 17);

      const result = providers.php.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '["HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });

    it("returns undefined at line 0 and wrong position for $_SERVER[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(4, 18);

      const result = providers.php.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for $_SERVER[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(4, 20);

      const result = providers.php.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '["HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });

    it("returns undefined at line 0 and wrong position for getenv() format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(5, 16);

      const result = providers.phpGetEnv.provideCompletionItems(
        document,
        position
      );

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for getenv() format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(5, 18);

      const result = providers.phpGetEnv.provideCompletionItems(
        document,
        position
      );

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#goCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const goFile = path.join(__dirname, "..", "examples", "go.go");
      const document = await vscode.workspace.openTextDocument(goFile);
      const position = new vscode.Position(1, 8);

      const result = providers.go.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const goFile = path.join(__dirname, "..", "examples", "go.go");
      const document = await vscode.workspace.openTextDocument(goFile);
      const position = new vscode.Position(1, 10);

      const result = providers.go.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#javaCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const javaFile = path.join(__dirname, "..", "examples", "java.java");
      const document = await vscode.workspace.openTextDocument(javaFile);
      const position = new vscode.Position(1, 8);

      const result = providers.java.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const javaFile = path.join(__dirname, "..", "examples", "java.java");
      const document = await vscode.workspace.openTextDocument(javaFile);
      const position = new vscode.Position(1, 11);

      const result = providers.java.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#csharpCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const csharpFile = path.join(__dirname, "..", "examples", "csharp.cs");
      const document = await vscode.workspace.openTextDocument(csharpFile);
      const position = new vscode.Position(1, 32);

      const result = providers.csharp.provideCompletionItems(
        document,
        position
      );

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const csharpFile = path.join(__dirname, "..", "examples", "csharp.cs");
      const document = await vscode.workspace.openTextDocument(csharpFile);
      const position = new vscode.Position(1, 35);

      const result = providers.csharp.provideCompletionItems(
        document,
        position
      );

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });

  describe("#rustCompletion", function () {
    it("returns undefined at line 0 and wrong position with var format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(1, 12);

      const result = providers.rust.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position with var format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(1, 14);

      const result = providers.rust.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });

    it("returns undefined at line 0 and wrong position with var_os format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(3, 15);

      const result = providers.rust.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position with var_os format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(3, 17);

      const result = providers.rust.provideCompletionItems(document, position);

      assert.equal(result[0].insertText, '("HELLO"');
      assert.equal(result[0].label.label, "HELLO");
      assert.equal(result[0].label.detail, " World");
    });
  });
});

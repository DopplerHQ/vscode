const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const assert = require("assert");
const path = require("path");
const vscode = require("vscode");

const providers = require("../../../../out/lib/autocomplete/providers");

const configuration = vscode.workspace.getConfiguration("doppler");
configuration.update("autocomplete.enable", true, vscode.ConfigurationTarget.Global);
vscode.workspace.updateWorkspaceFolders(0, 0, { uri: vscode.Uri.parse(path.join(__dirname, "..", "..")) });

describe("autcomplete providers", function () {
  describe("#javascriptCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const javascriptFile = path.join(__dirname, "..", "examples", "javascript.js");
      const document = await vscode.workspace.openTextDocument(javascriptFile);
      const position = new vscode.Position(1, 22);

      const result = await providers.javascript.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const javascriptFile = path.join(__dirname, "..", "examples", "javascript.js");
      const document = await vscode.workspace.openTextDocument(javascriptFile);
      const position = new vscode.Position(1, 24);

      const results = await providers.javascript.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, ".HELLO");
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#rubyCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const rubyFile = path.join(__dirname, "..", "examples", "ruby.rb");
      const document = await vscode.workspace.openTextDocument(rubyFile);
      const position = new vscode.Position(1, 7);

      const result = await providers.ruby.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const rubyFile = path.join(__dirname, "..", "examples", "ruby.rb");
      const document = await vscode.workspace.openTextDocument(rubyFile);
      const position = new vscode.Position(1, 9);

      const results = await providers.ruby.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '["HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#pythonCompletion", function () {
    it("returns undefined at line 0 and wrong position for os.environ.get format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(3, 19);

      const result = await providers.python.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for os.environ.get format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(3, 21);

      const results = await providers.python.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });

    it("returns undefined at line 0 and wrong position for os.getenv format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(4, 13);

      const result = await providers.python.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for os.getenv format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(4, 16);

      const results = await providers.python.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });

    it("returns undefined at line 0 and wrong position for os.environ[] format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(5, 15);

      const result = await providers.pythonArray.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for os.environ[] format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(5, 17);

      const results = await providers.pythonArray.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '["HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#phpCompletion", function () {
    it("returns undefined at line 0 and wrong position for $_ENV[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(3, 15);

      const result = await providers.php.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for $_ENV[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(3, 17);

      const results = await providers.php.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '["HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });

    it("returns undefined at line 0 and wrong position for $_SERVER[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(4, 18);

      const result = await providers.php.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for $_SERVER[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(4, 20);

      const results = await providers.php.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '["HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });

    it("returns undefined at line 0 and wrong position for getenv() format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(5, 16);

      const result = await providers.phpGetEnv.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position for getenv() format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(5, 18);

      const results = await providers.phpGetEnv.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#goCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const goFile = path.join(__dirname, "..", "examples", "go.go");
      const document = await vscode.workspace.openTextDocument(goFile);
      const position = new vscode.Position(1, 8);

      const result = await providers.go.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const goFile = path.join(__dirname, "..", "examples", "go.go");
      const document = await vscode.workspace.openTextDocument(goFile);
      const position = new vscode.Position(1, 10);

      const results = await providers.go.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#javaCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const javaFile = path.join(__dirname, "..", "examples", "java.java");
      const document = await vscode.workspace.openTextDocument(javaFile);
      const position = new vscode.Position(1, 8);

      const result = await providers.java.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const javaFile = path.join(__dirname, "..", "examples", "java.java");
      const document = await vscode.workspace.openTextDocument(javaFile);
      const position = new vscode.Position(1, 11);

      const results = await providers.java.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#csharpCompletion", function () {
    it("returns undefined at line 0 and wrong position", async function () {
      const csharpFile = path.join(__dirname, "..", "examples", "csharp.cs");
      const document = await vscode.workspace.openTextDocument(csharpFile);
      const position = new vscode.Position(1, 32);

      const result = await providers.csharp.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position", async function () {
      const csharpFile = path.join(__dirname, "..", "examples", "csharp.cs");
      const document = await vscode.workspace.openTextDocument(csharpFile);
      const position = new vscode.Position(1, 35);

      const results = await providers.csharp.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });

  describe("#rustCompletion", function () {
    it("returns undefined at line 0 and wrong position with var format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(1, 12);

      const result = await providers.rust.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position with var format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(1, 14);

      const results = await providers.rust.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });

    it("returns undefined at line 0 and wrong position with var_os format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(3, 15);

      const result = await providers.rust.provideCompletionItems(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at line 1 and correct position with var_os format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(3, 17);

      const results = await providers.rust.provideCompletionItems(document, position);
      const result = results.find((result) => result.label.label === "HELLO");

      assert.equal(result.insertText, '("HELLO"');
      assert.equal(result.label.label, "HELLO");
      assert.equal(result.label.detail, " Doppler: vscode.test.HELLO");
    });
  });
});

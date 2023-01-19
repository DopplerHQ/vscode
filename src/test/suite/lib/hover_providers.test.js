const mocha = require("mocha");
const describe = mocha.describe;
const it = mocha.it;
const assert = require("assert");
const path = require("path");
const vscode = require("vscode");

const providers = require("../../../lib/hover/providers");

describe("hover providers", function () {
  describe("#javascriptHover", function () {
    it("returns undefined at 0 line", async function () {
      const javascriptFile = path.join(__dirname, "..", "examples", "javascript.js");
      const document = await vscode.workspace.openTextDocument(javascriptFile);
      const position = new vscode.Position(0, 22);

      const result = providers.javascript.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position", async function () {
      const javascriptFile = path.join(__dirname, "..", "examples", "javascript.js");
      const document = await vscode.workspace.openTextDocument(javascriptFile);
      const position = new vscode.Position(0, 26);

      const result = providers.javascript.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#rubyHover", function () {
    it("returns undefined at 0 line", async function () {
      const rubyFile = path.join(__dirname, "..", "examples", "ruby.rb");
      const document = await vscode.workspace.openTextDocument(rubyFile);
      const position = new vscode.Position(0, 9);

      const result = providers.ruby.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position", async function () {
      const rubyFile = path.join(__dirname, "..", "examples", "ruby.rb");
      const document = await vscode.workspace.openTextDocument(rubyFile);
      const position = new vscode.Position(0, 13);

      const result = providers.ruby.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#pythonHover", function () {
    it("returns undefined at 0 line for os.environ.get format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(0, 19);

      const result = providers.python.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position for os.environ.get format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(0, 23);

      const result = providers.python.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });

    it("returns undefined at 0 line for os.getenv format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(1, 13);

      const result = providers.python.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position for os.getenv format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(1, 17);

      const result = providers.python.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });

    it("returns undefined at 0 line for os.environ[] format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(2, 14);

      const result = providers.python.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position for os.environ[] format", async function () {
      const pythonFile = path.join(__dirname, "..", "examples", "python.py");
      const document = await vscode.workspace.openTextDocument(pythonFile);
      const position = new vscode.Position(2, 18);

      const result = providers.python.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#phpHover", function () {
    it("returns undefined at 0 line for $_ENV[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(0, 15);

      const result = providers.php.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position for $_ENV[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(0, 20);

      const result = providers.php.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });

    it("returns undefined at 0 line for $_SERVER[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(1, 17);

      const result = providers.php.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position for $_SERVER[] format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(1, 22);

      const result = providers.php.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });

    it("returns undefined at 0 line for getenv() format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(2, 16);

      const result = providers.php.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position for getenv() format", async function () {
      const phpFile = path.join(__dirname, "..", "examples", "php.php");
      const document = await vscode.workspace.openTextDocument(phpFile);
      const position = new vscode.Position(2, 22);

      const result = providers.php.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#goHover", function () {
    it("returns undefined at 0 line", async function () {
      const goFile = path.join(__dirname, "..", "examples", "go.go");
      const document = await vscode.workspace.openTextDocument(goFile);
      const position = new vscode.Position(0, 9);

      const result = providers.go.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position", async function () {
      const goFile = path.join(__dirname, "..", "examples", "go.go");
      const document = await vscode.workspace.openTextDocument(goFile);
      const position = new vscode.Position(0, 13);

      const result = providers.go.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#javaHover", function () {
    it("returns undefined at 0 line", async function () {
      const javaFile = path.join(__dirname, "..", "examples", "java.java");
      const document = await vscode.workspace.openTextDocument(javaFile);
      const position = new vscode.Position(0, 9);

      const result = providers.java.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position", async function () {
      const javaFile = path.join(__dirname, "..", "examples", "java.java");
      const document = await vscode.workspace.openTextDocument(javaFile);
      const position = new vscode.Position(0, 16);

      const result = providers.java.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#csharpHover", function () {
    it("returns undefined at 0 line", async function () {
      const csharpFile = path.join(__dirname, "..", "examples", "csharp.cs");
      const document = await vscode.workspace.openTextDocument(csharpFile);
      const position = new vscode.Position(0, 32);

      const result = providers.csharp.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position", async function () {
      const csharpFile = path.join(__dirname, "..", "examples", "csharp.cs");
      const document = await vscode.workspace.openTextDocument(csharpFile);
      const position = new vscode.Position(0, 37);

      const result = providers.csharp.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });

  describe("#rustHover", function () {
    it("returns undefined at 0 line with var format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(0, 12);

      const result = providers.rust.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position with var format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(0, 16);

      const result = providers.rust.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });

    it("returns undefined at 0 line with var_os format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(2, 12);

      const result = providers.rust.provideHover(document, position);

      assert.equal(result, undefined);
    });

    it("returns value at 0 line and correct position with var_os format", async function () {
      const rustFile = path.join(__dirname, "..", "examples", "rust.rs");
      const document = await vscode.workspace.openTextDocument(rustFile);
      const position = new vscode.Position(2, 22);

      const result = providers.rust.provideHover(document, position);

      assert.equal(result.contents[0], "World");
    });
  });
});

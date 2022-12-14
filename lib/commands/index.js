const vscode = require("vscode");

module.exports = function (context) {
  const commands = {
    login: require("./login"),
    logout: require("./logout"),
    setup: require("./setup"),
    documentation: require("./documentation"),
  };

  for (const [name, callback] of Object.entries(commands)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `doppler.${name}`,
        callback.bind(commands)
      )
    );
  }
};

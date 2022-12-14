const plugins = [require("./lib/commands")];

module.exports.activate = function (context) {
  for (const plugin of plugins) {
    plugin(context);
  }

  console.log("Doppler VS Code Plugin has been enabled.");
};

module.exports.deactivate = function () {
  console.log("Doppler VS Code Plugin has been disabled.");
};
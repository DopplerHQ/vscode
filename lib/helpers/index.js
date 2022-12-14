const DopplerTerminal = require("./terminal");
const DopplerParser = require("./parser");

class DopplerHelpers {
  constructor() {
    this.terminal = new DopplerTerminal();
    this.parser = new DopplerParser();
  }

  async interval(time, expireAfter, callback) {
    let timeOut;

    return new Promise(function (resolve, reject) {
      const interval = setInterval(async function () {
        await callback(function () {
          clearInterval(interval);
          clearTimeout(timeOut);
          resolve();
        });
      }, time);

      timeOut = setTimeout(function () {
        clearInterval(interval);
        reject("Doppler: Interval failed to be successful");
      }, expireAfter);
    });
  }
}

module.exports = new DopplerHelpers();

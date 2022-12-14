const vscode = require("vscode");
const axios = require("axios");
const https = require("https");
const packageJSON = require("../../package");

const REQUEST_TIMEOUT = 30000; // 30 seconds
const SHOW_LOADER_AFTER = 750; // 0.75 seconds
const MAX_ITEMS_PER_PAGE = 100;

class DopplerRequest {
  constructor(doppler) {
    this.auth = doppler.auth;
  }

  async _generate() {
    await this.auth.enforceAuthentication();
    const token = await this.auth.token();

    return axios.create({
      baseURL: await this.auth.apiHost(),
      timeout: REQUEST_TIMEOUT,
      httpsAgent: new https.Agent({
        minVersion: "TLSv1.2",
      }),
      headers: {
        "User-Agent": `vscode-plugin/${packageJSON.version} vscode/${vscode.version}`,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async _wrapPromiseWithLoader(promise) {
    let progressReporter = null;

    // Show progress bar for long running requests
    const timeout = setTimeout(function () {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Doppler is loading ...",
          cancellable: false,
        },
        async (progress) => {
          progressReporter = progress;
        }
      );
    }, SHOW_LOADER_AFTER);

    // Hide progress bar after request completes
    return promise
      .then(function (response) {
        clearTimeout(timeout);
        progressReporter?.report({ increment: 100 });
        return response;
      })
      .catch(function (error) {
        clearTimeout(timeout);
        progressReporter?.report({ increment: 100 });
        throw error;
      });
  }

  async get(path, options = {}) {
    try {
      const request = await this._generate();
      const response = await this._wrapPromiseWithLoader(
        request.get(path, options)
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.messages.join(" ") || error.message);
    }
  }

  async getAllPages(property, path, options = {}) {
    let page = 1;
    const totalList = [];

    options.params = options.params || {};
    options.params.per_page = MAX_ITEMS_PER_PAGE;

    while (true) {
      const optionsForPage = Object.assign({}, options);
      optionsForPage.params.page = page;

      const response = await this.get(path, optionsForPage);
      const responseList = response[property];

      totalList.push(...responseList);
      page += 1;

      if (responseList.length < MAX_ITEMS_PER_PAGE) {
        break;
      }
    }

    return { [property]: totalList };
  }

  async post(path, options = {}) {
    try {
      const request = await this._generate();
      const response = await this._wrapPromiseWithLoader(
        request.post(path, options)
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.messages.join(" ") || error.message);
    }
  }
}

module.exports = DopplerRequest;

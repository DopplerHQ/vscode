import * as vscode from "vscode";
import axios, { AxiosResponse } from "axios";
import * as https from "https";
import DopplerAuth from "./auth";

/* eslint @typescript-eslint/no-var-requires: "off" */
const packageJSON = require("../../../package.json");

const REQUEST_TIMEOUT = 30000; // 30 seconds
const SHOW_LOADER_AFTER = 750; // 0.75 seconds
const MAX_ITEMS_PER_PAGE = 100;
const MAX_PAGE_ITERATIONS = 100;

export default class DopplerRequest {
  private auth: DopplerAuth;

  constructor(auth: DopplerAuth) {
    this.auth = auth;
  }

  private async generate() {
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

  private async wrapPromiseWithLoader(promise: Promise<AxiosResponse>) {
    let progressReporter: vscode.Progress<{
      message?: string;
      increment?: number;
    }> | null;

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

  public async get(path: string, options: any = {}) {
    try {
      const request = await this.generate();
      const response = await this.wrapPromiseWithLoader(
        request.get(path, options)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.messages.join(" ") || error.message);
    }
  }

  public async getAllPages(property: string, path: string, options: any = {}) {
    let page = 1;
    const totalList = [];

    options.params = options.params || {};
    options.params.per_page = MAX_ITEMS_PER_PAGE;

    for (let i = 0; i < MAX_PAGE_ITERATIONS; i++) {
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

  public async post(path: string, options: any = {}) {
    try {
      const request = await this.generate();
      const response = await this.wrapPromiseWithLoader(
        request.post(path, options)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.messages.join(" ") || error.message);
    }
  }
}

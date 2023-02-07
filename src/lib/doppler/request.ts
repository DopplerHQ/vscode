import { version, window, Progress, ProgressLocation } from "vscode";
import axios, { AxiosResponse } from "axios";
import * as https from "https";
import DopplerAuth from "./auth";

/* eslint @typescript-eslint/no-var-requires: "off" */
const packageJSON = require("../../../package.json");

const REQUEST_TIMEOUT = 30000; // 30 seconds
const SHOW_LOADER_AFTER = 1000; // 1 seconds
const MAX_ITEMS_PER_PAGE = 100;
const MAX_PAGE_ITERATIONS = 100;

export default class DopplerRequest {
  private auth: DopplerAuth;
  private requestLoader: DopplerRequestLoader;

  constructor(auth: DopplerAuth) {
    this.auth = auth;
    this.requestLoader = new DopplerRequestLoader();
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
        "User-Agent": `vscode-plugin/${packageJSON.version} vscode/${version}`,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async get(path: string, options: any = {}) {
    try {
      const request = await this.generate();
      const response = await this.requestLoader.wrap(request.get(path, options));
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
      const response = await this.requestLoader.wrap(request.post(path, options));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.messages.join(" ") || error.message);
    }
  }
}

class DopplerRequestLoader {
  private requests = new Map<Promise<AxiosResponse>, NodeJS.Timeout>();
  private progressReporter: Progress<{
    message?: string;
    increment?: number;
  }> | null = null;

  public async wrap(promise: Promise<AxiosResponse>) {
    this.addRequest(promise);

    // Hide progress bar after request completes
    return promise
      .then((response) => {
        this.removeRequest(promise);
        return response;
      })
      .catch((error) => {
        this.removeRequest(promise);
        throw error;
      });
  }

  private addRequest(promise: Promise<AxiosResponse>) {
    const timeout = setTimeout(() => {
      this.showProgressBar();
    }, SHOW_LOADER_AFTER);

    this.requests.set(promise, timeout);
  }

  private removeRequest(promise: Promise<AxiosResponse>) {
    const timeout = this.requests.get(promise);
    clearTimeout(timeout);
    this.requests.delete(promise);

    if (this.requests.size === 0) {
      this.hideProgressBar();
    }
  }

  private showProgressBar() {
    if (this.progressReporter !== null) {
      return;
    }

    window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: "Doppler is loading ...",
        cancellable: false,
      },
      async (progress) => {
        this.progressReporter = progress;
      }
    );
  }

  private hideProgressBar() {
    this.progressReporter?.report({ increment: 100 });
    this.progressReporter = null;
  }
}

import * as helpers from "../helpers";

export default class DopplerAuth {
  public async apiHost() {
    const host = await helpers.terminal.run("doppler configure get api-host --plain");
    return host || "https://api.doppler.com";
  }

  public async dashboardHost() {
    const host = await helpers.terminal.run("doppler configure get dashboard-host --plain");
    return host || "https://dashboard.doppler.com";
  }

  public async token() {
    await this.enforceDopplerCLI();
    return await helpers.terminal.run("doppler configure get token --plain");
  }

  public async project() {
    await this.enforceDopplerCLI();
    return await helpers.terminal.run("doppler configure get project --plain");
  }

  public async config() {
    await this.enforceDopplerCLI();
    return await helpers.terminal.run("doppler configure get config --plain");
  }

  public async isAuthenticated() {
    const token = await this.token();
    return token.length > 0;
  }

  public async isScopeConfigured() {
    return [await this.project(), await this.config()].every((element) => element.length > 0);
  }

  public async hasDopplerCLI() {
    return await helpers.terminal.exists("doppler");
  }

  public async enforceDopplerCLI() {
    if (!(await this.hasDopplerCLI())) {
      throw new Error("Install the Doppler CLI with the 'Doppler: Install' command");
    }
  }

  public async enforceAuthentication() {
    if (!(await this.isAuthenticated())) {
      throw new Error("Login with the 'Doppler: Login' command");
    }
  }

  public async enforceScope() {
    if (!(await this.isScopeConfigured())) {
      throw new Error("Scope this workspace with the 'Doppler: Setup' command");
    }
  }
}

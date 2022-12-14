const helpers = require("../helpers");

class DopplerAuth {
  async apiHost() {
    const host = await helpers.terminal.run(
      "doppler configure get api-host --plain"
    );
    return host || "https://api.doppler.com";
  }

  async dashboardHost() {
    const host = await helpers.terminal.run(
      "doppler configure get dashboard-host --plain"
    );
    return host || "https://dashboard.doppler.com";
  }

  async token() {
    await this.enforceDopplerCLI();
    return await helpers.terminal.run("doppler configure get token --plain");
  }

  async project() {
    await this.enforceDopplerCLI();
    return await helpers.terminal.run("doppler configure get project --plain");
  }

  async config() {
    await this.enforceDopplerCLI();
    return await helpers.terminal.run("doppler configure get config --plain");
  }

  async isAuthenticated() {
    const token = await this.token();
    return token.length > 0;
  }

  async isScopeConfigured() {
    return [await this.project(), await this.config()].every(
      (element) => element.length > 0
    );
  }

  async hasDopplerCLI() {
    return await helpers.terminal.exists("doppler");
  }

  async enforceDopplerCLI() {
    if (!(await this.hasDopplerCLI())) {
      throw new Error("Doppler: Scope this directory with the 'setup' command");
    }
  }

  async enforceAuthentication() {
    if (!(await this.isAuthenticated())) {
      throw new Error("Doppler: Login to the Doppler CLI");
    }
  }

  async enforceScope() {
    if (!(await this.isScopeConfigured())) {
      throw new Error("Doppler: Scope this directory with the 'setup' command");
    }
  }
}

module.exports = DopplerAuth;

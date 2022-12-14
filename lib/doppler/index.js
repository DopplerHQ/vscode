const DopplerAuth = require("./auth");
const DopplerRequest = require("./request");
const DopplerProjects = require("./projects");
const DopplerEnvironments = require("./environments");
const DopplerConfigs = require("./configs");
const DopplerSecrets = require("./secrets");
const DopplerWorkplace = require("./workplace");

class Doppler {
  constructor() {
    this.auth = new DopplerAuth();
    this.request = new DopplerRequest(this);
    this.projects = new DopplerProjects(this);
    this.environments = new DopplerEnvironments(this);
    this.configs = new DopplerConfigs(this);
    this.secrets = new DopplerSecrets(this);
    this.workplace = new DopplerWorkplace(this);
  }
}

module.exports = new Doppler();

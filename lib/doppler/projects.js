class DopplerProjects {
  constructor(doppler) {
    this.request = doppler.request;
  }

  async fetch() {
    const response = await this.request.getAllPages("projects", `/v3/projects`);
    return response.projects;
  }
}

module.exports = DopplerProjects;

class DopplerEnvironments {
  constructor(doppler) {
    this.request = doppler.request;
  }

  async fetch(project) {
    const response = await this.request.getAllPages(
      "environments",
      `/v3/environments`,
      {
        params: { project },
      }
    );

    return response.environments;
  }
}

module.exports = DopplerEnvironments;

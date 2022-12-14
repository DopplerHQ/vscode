class DopplerConfigs {
  constructor(doppler) {
    this.request = doppler.request;
  }

  async fetch(project) {
    const response = await this.request.getAllPages("configs", `/v3/configs`, {
      params: { project },
    });

    return response.configs;
  }
}

module.exports = DopplerConfigs;

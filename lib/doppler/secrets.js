class DopplerSecrets {
  constructor(doppler) {
    this.auth = doppler.auth;
    this.request = doppler.request;
  }

  async fetch(project, config) {
    const response = await this.request.get(`/v3/configs/config/secrets`, {
      params: { project, config },
    });
    const { secrets } = response;

    for (const [key, value] of Object.entries(secrets)) {
      secrets[key] = value.computed;
    }

    return secrets;
  }

  async fetchRaw(project, config) {
    const response = await this.request.get(`/v3/configs/config/secrets`, {
      params: { project, config },
    });
    const { secrets } = response;

    for (const [key, value] of Object.entries(secrets)) {
      secrets[key] = value.raw;
    }

    return secrets;
  }

  async fetchSecret(project, config, name) {
    const response = await this.request.get(`/v3/configs/config/secret`, {
      params: { project, config, name },
    });

    return response.value.computed;
  }

  async fetchFromScope() {
    await this.auth.enforceScope();

    const project = await this.auth.project();
    const config = await this.auth.config();
    return await this.fetch(project, config);
  }

  async update(project, config, secrets) {
    await this.request.post(`/v3/configs/config/secrets`, {
      project,
      config,
      secrets,
    });
  }
}

module.exports = DopplerSecrets;

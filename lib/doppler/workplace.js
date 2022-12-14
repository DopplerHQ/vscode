class DopplerWorkplace {
  constructor(doppler) {
    this.request = doppler.request;
  }

  async fetch() {
    const response = await this.request.get(`/v3/workplace`);
    return response.workplace;
  }
}

module.exports = DopplerWorkplace;

import DopplerRequest from "./request";

export interface DopplerWorkplace {
  id: string;
  name: string;
  billing_email: string;
}

export class DopplerWorkplaceProvider {
  private request: DopplerRequest;

  constructor(request: DopplerRequest) {
    this.request = request;
  }

  public async fetch() {
    const response = await this.request.get(`/v3/workplace`);
    return response.workplace as DopplerWorkplace;
  }
}

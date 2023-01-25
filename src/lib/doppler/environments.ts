import DopplerRequest from "./request";

export interface DopplerEnvironment {
  id: string;
  name: string;
  project: string;
  created_at: string;
  initial_fetch_at: string;
}

export class DopplerEnvironmentsProvider {
  private request: DopplerRequest;

  constructor(request: DopplerRequest) {
    this.request = request;
  }

  public async fetch(project: string) {
    const response = await this.request.getAllPages("environments", `/v3/environments`, {
      params: { project },
    });

    return response.environments as DopplerEnvironment[];
  }
}

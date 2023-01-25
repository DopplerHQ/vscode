import DopplerRequest from "./request";

export interface DopplerProject {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export class DopplerProjectsProvider {
  private request: DopplerRequest;

  constructor(request: DopplerRequest) {
    this.request = request;
  }

  public async fetch() {
    const response = await this.request.getAllPages("projects", `/v3/projects`);
    return response.projects as DopplerProject[];
  }
}

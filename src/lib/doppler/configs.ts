import DopplerRequest from "./request";

export interface DopplerConfig {
  name: string;
  root: boolean;
  locked: boolean;
  environment: string;
  project: string;
  created_at: string;
  initial_fetch_at: string;
  last_fetch_at: string;
}

export class DopplerConfigsProvider {
  private request: DopplerRequest;

  constructor(request: DopplerRequest) {
    this.request = request;
  }

  public async fetch(project: string, environment?: string) {
    const response = await this.request.getAllPages("configs", `/v3/configs`, {
      params: { project, environment },
    });

    return response.configs as DopplerConfig[];
  }

  public async add(project: string, environment: string, name: string) {
    const response = await this.request.post('/v3/configs', {
      project,
      environment,
      name: name.trim(),
    });

    return response.config as DopplerConfig;
  }
}

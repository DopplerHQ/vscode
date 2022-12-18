import DopplerAuth from "./auth";
import DopplerRequest from "./request";

export interface DopplerSecrets {
  [key: string]: string;
}

export interface DopplerSecretsUpdate {
  [key: string]: string | null;
}

interface DopplerSecretWithRaw {
  raw: string;
  computed: string;
}

interface DopplerSecretsWithRaw {
  [key: string]: DopplerSecretWithRaw;
}

export class DopplerSecretsProvider {
  private auth: DopplerAuth;
  private request: DopplerRequest;

  constructor(auth: DopplerAuth, request: DopplerRequest) {
    this.auth = auth;
    this.request = request;
  }

  public async fetch(project: string, config: string): Promise<DopplerSecrets> {
    const response = await this.request.get(`/v3/configs/config/secrets`, {
      params: { project, config },
    });

    const secretsWithRaw = response.secrets as DopplerSecretsWithRaw;
    const secrets: DopplerSecrets = {};

    for (const [key, value] of Object.entries(secretsWithRaw)) {
      secrets[key] = value.computed;
    }

    return secrets;
  }

  public async fetchRaw(
    project: string,
    config: string
  ): Promise<DopplerSecrets> {
    const response = await this.request.get(`/v3/configs/config/secrets`, {
      params: { project, config },
    });

    const secretsWithRaw = response.secrets as DopplerSecretsWithRaw;
    const secrets: DopplerSecrets = {};

    for (const [key, value] of Object.entries(secretsWithRaw)) {
      secrets[key] = value.raw;
    }

    return secrets;
  }

  public async fetchSecret(
    project: string,
    config: string,
    name: string
  ): Promise<DopplerSecrets> {
    const response = await this.request.get(`/v3/configs/config/secret`, {
      params: { project, config, name },
    });

    return response.value.computed;
  }

  public async fetchFromScope(): Promise<DopplerSecrets> {
    await this.auth.enforceScope();

    const project = await this.auth.project();
    const config = await this.auth.config();
    return await this.fetch(project, config);
  }

  public async update(
    project: string,
    config: string,
    secrets: DopplerSecretsUpdate
  ) {
    await this.request.post(`/v3/configs/config/secrets`, {
      project,
      config,
      secrets,
    });
  }
}

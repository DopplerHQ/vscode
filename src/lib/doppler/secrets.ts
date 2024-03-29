import DopplerAuth from "./auth";
import DopplerRequest from "./request";

export interface DopplerSecrets {
  [key: string]: string | null;
}

export interface DopplerSecretsUpdate {
  [key: string]: string | null;
}

interface DopplerSecretWithRaw {
  raw: string | null;
  computed: string | null;
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
      params: { project, config, include_managed_secrets: false },
    });

    const secretsWithRaw = response.secrets as DopplerSecretsWithRaw;
    const secrets: DopplerSecrets = {};

    for (const [key, value] of Object.entries(secretsWithRaw)) {
      secrets[key] = value.computed;
    }

    return secrets;
  }

  public async fetchRaw(project: string, config: string): Promise<DopplerSecrets> {
    const response = await this.request.get(`/v3/configs/config/secrets`, {
      params: { project, config, include_managed_secrets: false, raw_only: true },
    });

    const secretsWithRaw = response.secrets as DopplerSecretsWithRaw;
    const secrets: DopplerSecrets = {};

    for (const [key, value] of Object.entries(secretsWithRaw)) {
      secrets[key] = value.raw;
    }

    return secrets;
  }

  public async fetchSecret(project: string, config: string, name: string): Promise<DopplerSecrets> {
    const response = await this.request.get(`/v3/configs/config/secret`, {
      params: { project, config, name },
    });

    return response.value.computed;
  }

  public async fetchNames(project: string, config: string): Promise<[string]> {
    const response = await this.request.get(`/v3/configs/config/secrets/names`, {
      params: { project, config, include_dynamic_secrets: true },
    });

    return response.names;
  }

  public async update(project: string, config: string, secrets: DopplerSecretsUpdate) {
    await this.request.post(`/v3/configs/config/secrets`, {
      project,
      config,
      secrets,
    });
  }
}

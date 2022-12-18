import DopplerAuth from "./auth";
import DopplerRequest from "./request";
import { DopplerProjectsProvider, DopplerProject } from "./projects";
import {
  DopplerEnvironmentsProvider,
  DopplerEnvironment,
} from "./environments";
import { DopplerConfigsProvider, DopplerConfig } from "./configs";
import {
  DopplerSecretsProvider,
  DopplerSecrets,
  DopplerSecretsUpdate,
} from "./secrets";
import { DopplerWorkplaceProvider, DopplerWorkplace } from "./workplace";

const auth = new DopplerAuth();
const request = new DopplerRequest(auth);
const projects = new DopplerProjectsProvider(request);
const environments = new DopplerEnvironmentsProvider(request);
const configs = new DopplerConfigsProvider(request);
const secrets = new DopplerSecretsProvider(auth, request);
const workplace = new DopplerWorkplaceProvider(request);

export {
  auth,
  projects,
  environments,
  configs,
  secrets,
  workplace,
  DopplerProject,
  DopplerEnvironment,
  DopplerConfig,
  DopplerSecrets,
  DopplerSecretsUpdate,
  DopplerWorkplace,
};

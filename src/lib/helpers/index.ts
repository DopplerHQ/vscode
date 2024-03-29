import DopplerTerminal from "./terminal";
import DopplerParser from "./parser";
import { interval } from "./interval";
import { isWindows } from "./os";

export const terminal = new DopplerTerminal();
export const parser = new DopplerParser();
export { interval };
export { isWindows };

import { PinoLogger } from "@mastra/loggers";
import { Mastra } from "@mastra/core/mastra";
import { weatherWorkflow } from "./workflows/weather-workflow.ts";
import { storage, weatherAgent } from "./agents/weather-agent.ts";

export const mastra = new Mastra({
  agents: { weatherAgent },
  workflows: { weatherWorkflow },
  logger: new PinoLogger({
    name: "mastra",
    level: "info",
  }),
  storage,
});

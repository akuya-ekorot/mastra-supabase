import { Hono } from "jsr:@hono/hono";
import { RuntimeContext } from "@mastra/core/di";
import { mastra } from "./mastra/index.ts";
import * as Agents from "@mastra/server/handlers/agents";
import * as Workflows from "@mastra/server/handlers/workflows";

const FUNCTION_NAME = "api";
const runtimeContext = new RuntimeContext();

const app = new Hono().basePath(`/${FUNCTION_NAME}`);

app.get("", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("agents", async (c) => {
  return c.json(
    await Agents.getAgentsHandler({
      mastra,
      runtimeContext,
    }),
  );
});

app.get("agents/:agentId", async (c) => {
  const agentId = c.req.param("agentId");

  return c.json(
    await Agents.getAgentByIdHandler({
      mastra,
      runtimeContext,
      agentId,
    }),
  );
});

app.post("agents/:agentId/generate", async (c) => {
  const agentId = c.req.param("agentId");
  const { messages } = await c.req.json();

  return c.json(
    await Agents.generateHandler({
      mastra,
      runtimeContext,
      agentId,
      body: {
        messages,
      },
    }),
  );
});

app.post("agents/:agentId/stream", async (c) => {
  const agentId = c.req.param("agentId");
  const { messages } = await c.req.json();

  return await Agents.streamGenerateHandler({
    mastra,
    runtimeContext,
    agentId,
    body: {
      messages,
    },
  });
});

app.get("agents/:agentId/evals/ci", async (c) => {
  const agentId = c.req.param("agentId");

  return c.json(
    await Agents.getEvalsByAgentIdHandler({
      mastra,
      runtimeContext,
      agentId,
    }),
  );
});

app.get("agents/:agentId/evals/live", async (c) => {
  const agentId = c.req.param("agentId");

  return c.json(
    await Agents.getLiveEvalsByAgentIdHandler({
      mastra,
      runtimeContext,
      agentId,
    }),
  );
});

app.get("workflows", async (c) => {
  return c.json(
    await Workflows.getWorkflowsHandler({ mastra }),
  );
});

app.get("workflows/:workflowId", async (c) => {
  const workflowId = c.req.param("workflowId");

  return c.json(
    await Workflows.getWorkflowByIdHandler({
      mastra,
      workflowId,
    }),
  );
});

app.post("workflows/:workflowId/start", async (c) => {
  const workflowId = c.req.param("workflowId");
  const runId = c.req.query("runId");
  const body = await c.req.json();

  return c.json(
    await Workflows.startWorkflowRunHandler({
      mastra,
      runtimeContext,
      workflowId,
      runId,
      inputData: body.inputData,
    }),
  );
});

Deno.serve(app.fetch);

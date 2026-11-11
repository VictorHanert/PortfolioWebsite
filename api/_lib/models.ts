import { createGoogleGenerativeAI } from "@ai-sdk/google";

// The free Gemini tier is often overloaded and some newer models hang, so calls fall back down this list.
const AGENT_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-2.5-flash"];

type GoogleModel = ReturnType<ReturnType<typeof createGoogleGenerativeAI>>;

// One model object that tries each model in turn when a call fails before any output
export function agentModel(apiKey: string): GoogleModel {
  const google = createGoogleGenerativeAI({ apiKey });
  const models = AGENT_MODELS.map((id) => google(id));
  const [first] = models;

  const attempt = async <T>(run: (model: GoogleModel) => PromiseLike<T>): Promise<T> => {
    let lastError: unknown;
    for (const model of models) {
      try {
        return await run(model);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

  return {
    specificationVersion: first.specificationVersion,
    provider: first.provider,
    modelId: first.modelId,
    supportedUrls: first.supportedUrls,
    doGenerate: (options) => attempt((model) => model.doGenerate(options)),
    doStream: (options) => attempt((model) => model.doStream(options)),
  };
}

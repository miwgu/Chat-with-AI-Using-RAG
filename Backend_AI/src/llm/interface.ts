export interface LLMProvider {
  stream(prompt: string): AsyncGenerator<string>; //real time chat:UI
  invoke?(prompt: string): Promise<string>;//Non-streaming output: process in batches on the backend
}

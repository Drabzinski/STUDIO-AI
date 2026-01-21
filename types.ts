
export type AIModel = 'ChatGPT' | 'Gemini' | 'Claude' | 'Midjourney' | 'DALL-E' | 'Stable Diffusion' | 'Outra';

export type AppView = 'hero' | 'ai-select' | 'text-module' | 'image-module' | 'course' | 'result' | 'templates' | 'examples';

export interface PromptState {
  type: 'text' | 'image';
  selectedAI: AIModel;
  category: string;
  details: Record<string, string>;
  generatedPrompt: string;
}

export interface Template {
  id: string;
  title: string;
  type: 'text' | 'image';
  preview: string;
  prompt: string;
}

export interface Example {
  id: string;
  title: string;
  before: string;
  after: string;
  improvement: string;
}

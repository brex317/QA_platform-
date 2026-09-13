export interface HelpStep {
  stepNumber: number;
  stepText: string;
  number?: number;
  text?: string;
}

export interface HelpResponse {
  nodeKey: string;
  contextKey: string;
  title?: string;
  steps: HelpStep[];
}

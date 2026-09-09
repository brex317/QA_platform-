export interface HelpStep {
  number: number;
  text: string;
}

export interface HelpResponse {
  nodeKey: string;
  title: string;
  steps: HelpStep[];
}

export type Quadrant = 'aristocracy' | 'technocrats' | 'merchants' | 'proletariat';

export interface QuadrantData {
  id: Quadrant;
  title: string;
  xLabel: string;
  yLabel: string;
  description: string;
  tools: string[];
  archetypes: string[];
  color: string;
}

export interface UserStack {
  designTool: string;
  browser: string;
  projectManagement: string;
  knowledgeBase: string;
  communication: string;
}

export interface AnalysisResult {
  title: string;
  quadrant: Quadrant;
  roast: string;
  score: {
    cultural: number;
    economic: number;
  };
}

export const TOOLS_OPTIONS = {
  designTool: ['Figma', 'Canva', 'Adobe XD', 'MS Paint', 'Sketch'],
  browser: ['Arc', 'Chrome', 'Edge', 'Brave', 'Safari'],
  projectManagement: ['Linear', 'Jira', 'Trello', 'Notion', 'Excel'],
  knowledgeBase: ['Obsidian', 'Notion', 'Confluence', 'Google Docs', 'Apple Notes'],
  communication: ['Discord', 'Slack', 'Teams', 'Signal', 'Email'],
};
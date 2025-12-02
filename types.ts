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
  designTool: ['Figma', 'Canva', 'Adobe XD', 'MS Paint', 'Sketch', 'Pen & Paper', 'CSS/HTML'],
  browser: ['Arc', 'Chrome', 'Edge', 'Brave', 'Safari', 'Firefox', 'Tor'],
  projectManagement: ['Linear', 'Jira', 'Trello', 'Notion', 'Excel', 'Basecamp', 'Monday.com'],
  knowledgeBase: ['Obsidian', 'Notion', 'Confluence', 'Google Docs', 'Apple Notes', 'Roam Research', 'Substack'],
  communication: ['Discord', 'Slack', 'Teams', 'Signal', 'Email', 'WhatsApp', 'Zoom'],
};

export type VisualTheme = 'default' | 'memphis' | 'brutalist' | 'founder' | 'bento';

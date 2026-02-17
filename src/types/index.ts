export interface RepurposingIdea {
  id: string;
  type: string;
  title: string;
  content: string;
  hashtags: string[];
}

export interface RepurposeResponse {
  original_title: string;
  repurposing_ideas: RepurposingIdea[];
}

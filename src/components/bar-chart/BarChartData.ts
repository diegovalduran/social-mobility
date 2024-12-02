export interface BarData {
  label: string;           // Label for the row (e.g., team name)
  values: number[];        // Array of percentages
  isHighlighted?: boolean; // Optional highlight state
}

export interface ChartConfig {
  height?: number;
  barHeight?: number;
  colors?: string[];      // Array of colors for each bar type
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
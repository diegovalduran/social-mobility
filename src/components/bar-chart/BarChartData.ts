export interface BarData {
  label: string;          
  values: number[];      
  isHighlighted?: boolean;
}

export interface ChartConfig {
  height?: number;
  barHeight?: number;
  colors?: string[];    
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
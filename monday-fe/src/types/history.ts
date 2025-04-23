interface HistoryItem {
    factor: number;
    input: number;
    output: number;
  }
  
  interface Props {
    history: HistoryItem[];
  }

  export type {HistoryItem,Props}
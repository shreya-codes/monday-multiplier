interface MondayContext {
    data: {
      itemId: string
      itemName: string
      fullContext: any
      boardId: string
    }
  }
  
  interface MondayItem {
    id: string
    name: string
    inputValue?: number
    fullContext: any
    boardId: string
  }

  export type { MondayContext, MondayItem }
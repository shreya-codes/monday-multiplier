import { useEffect, useState } from 'react'
import mondaySdk from 'monday-sdk-js'
import { MondayContext,MondayItem } from '../src/types/monday'
const monday = mondaySdk()



const useMondayItem = () => {
  
  const [item, setItem] = useState<MondayItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      const getItem = async () => {
      try {
        const context = await monday.get('context') as MondayContext
        const itemId = context.data.itemId
        const itemName = context.data.itemName
        const boardId = context.data.boardId
       
        setItem({
          id: itemId,
          name: itemName,
          fullContext: context.data,
          boardId: boardId
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error occurred')
      }
    }

    getItem()
  }, [])
  return { item, error }
}

export default useMondayItem 
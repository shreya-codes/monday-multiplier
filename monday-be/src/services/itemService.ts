import Item from '../models/Item';
import { UpsertItemParams } from '../types/UpsertItemParams';
import History from '../models/History';
import { getMultiple } from './calculationService';
import { updateOutputColumnValue, getColumnValue } from './mondayservice';
import { UpdateFactorParams } from '../types/UpadateFactorParams';
import { addHistory } from './historyService';
import { COLUMN_ID } from '../constants/columnId';
const upsertItem = async ({ itemId, factor, input }: UpsertItemParams) => {
  const update: any = {};
  if (factor !== undefined) update.factor = factor;
  if (input !== undefined) update.input = input;
  
  try {
    let item = await Item.findOne({ itemId: itemId });
    
    if (item) {
      const updatedItem = await Item.findOneAndUpdate(
        { itemId: itemId },
        { $set: update },
        { new: true }
      );
      return updatedItem;
    } else {
      const newItem = await Item.create({
        itemId,
        factor: factor || 1,
        input: input || ''
      });
      return newItem;
    }
  } catch (error) {
    console.error('Error in upsertItem:', error);
    throw error;
  }
};

const getItem = async (itemId: string) => {
  try {
    return await Item.findOne({ itemId: itemId });
  } catch (error) {
    console.error('Error in getItem:', error);
    throw error;
  }
}

// Update multiplication factor
const updateFactor = async ({factor,boardId,itemId}: UpdateFactorParams) => {
  try {
    const input = await getColumnValue(itemId,COLUMN_ID.INPUT)
    
    const item = await upsertItem({
      itemId: itemId,
      factor: factor,
    });

    console.log('item', item);
    if (item && input && factor) {
      const result = await getMultiple(input, item.factor);
      await updateOutputColumnValue(boardId, itemId, result);

      const history = await addHistory(
        itemId,
        {
          itemId: itemId,
          factor: item.factor,
          input: input,
          output: result,
          createdAt: new Date()
        }
      )
      return { message: 'Factor updated successfully', history: history };
    } else {
      return { error: 'Please enter a valid input value' };
    }
  } catch (error) {
    console.error('Error in updateFactorHandler:', error);
    throw error;
  }
};

const getItemHistory = async (itemId: string) => {
  try {
    return await History.find({ itemId: itemId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error in getItemHistory:', error);
    throw error;  
  }
}
export { upsertItem, updateFactor, getItem, getItemHistory }; 
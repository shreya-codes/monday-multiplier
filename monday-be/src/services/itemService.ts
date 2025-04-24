import Item from '@models/Item';
import { UpsertItemParams } from '@/types/upsertItemParams';
import History from '@models/History';
import { getMultiple } from '@services/calculationService';
import { updateOutputColumnValue, getColumnValue } from '@services/mondayservice';
import { UpdateFactorParams } from '@/types/updateFactorParams';
import { addHistory } from '@services/historyService';
import { BaseError } from '@utils/baseError';
import logger from '@/utils/logger';

const OUTPUT_COLUMN_ID = process.env.OUTPUT_COLUMN_ID;
const INPUT_COLUMN_ID = process.env.INPUT_COLUMN_ID;

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
    throw new BaseError("Failed to upsert item", "UPSERT_ITEM_FAILED", 500, error);
  }
};

const getItem = async (itemId: string) => {
  try {
    return await Item.findOne({ itemId: itemId });
  } catch (error) {
    throw new BaseError("Failed to get item", "GET_ITEM_FAILED", 500, error);
  }
}

// Update multiplication factor
const updateFactor = async ({factor,boardId,itemId}: UpdateFactorParams) => {
  try {
    if (!INPUT_COLUMN_ID) {
      throw new BaseError("Input column ID not configured", "INPUT_COLUMN_ID_MISSING", 500);
    }
    const input = await getColumnValue(itemId, INPUT_COLUMN_ID);
    const item = await upsertItem({
      itemId: itemId,
      factor: factor,
    });

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
      throw new BaseError("Please enter a valid input value", "INVALID_INPUT_VALUE", 400);
    }
  } catch (error) {
    throw new BaseError("Failed to update factor", "UPDATE_FACTOR_FAILED", 500, error);
  }
};

const getItemHistory = async (itemId: string) => {
  try {
    return await History.find({ itemId: itemId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new BaseError("Failed to get item history", "GET_ITEM_HISTORY_FAILED", 500, error);
  }
}
export { upsertItem, updateFactor, getItem, getItemHistory }; 
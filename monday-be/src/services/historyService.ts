import HistoryModel from '@models/History';
import { HistoryRecord } from '@/types/history';
import Item from '@models/Item';
import { BaseError } from '@utils/baseError';

const addHistory = async (itemId: string, history: HistoryRecord) => {
    try {
      const historyRecord = await HistoryModel.create({
        itemId,
        factor: history.factor,
        input: history.input,
        output: history.output,
        createdAt: history.createdAt
      });
      await Item.findOneAndUpdate(
        { itemId: itemId },
        { $push: { history: historyRecord._id } },
        { new: true }
      );
      return historyRecord;
    } catch (error) {
      throw new BaseError("Failed to add history", "ADD_HISTORY_FAILED", 500, error);
    }
  }

const getHistory = async (itemId: string) => {
  try {
    return await HistoryModel.find({ itemId: itemId }).sort({ createdAt: -1 });
  } catch (error) {
    throw new BaseError("Failed to get history", "GET_HISTORY_FAILED", 500, error);
  }
}

export { addHistory, getHistory }; 
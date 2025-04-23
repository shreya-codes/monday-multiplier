import HistoryModel from '../models/History';
import { HistoryRecord } from '../types/History';
import Item from '../models/Item';

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
      console.error('Error in addHistory:', error);
      throw error;
    }
  }

const getHistory = async (itemId: string) => {
    return await HistoryModel.find({ itemId: itemId }).sort({ createdAt: -1 });
}

export { addHistory, getHistory }; 
import { getColumnIds } from './mondayservice';
import { BaseError } from '@utils/baseError';

interface ColumnConfig {
  inputColumnId?: string;
  outputColumnId?: string;
  lastUpdated: number;
}

const COLUMN_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const columnConfigs: Record<string, ColumnConfig> = {};

const getColumnConfig = async (boardId: string) => {
  const now = Date.now();
  const config = columnConfigs[boardId];

  if (config && (now - config.lastUpdated) < COLUMN_CACHE_TTL) {
    return config;
  }

  try {
    const columns = await getColumnIds(boardId);
    const inputColumn = columns.find(col => col.title === 'Input');
    const outputColumn = columns.find(col => col.title === 'Output');

    if (!inputColumn || !outputColumn) {
      throw new BaseError(
        'Required columns not found',
        'COLUMNS_NOT_FOUND',
        404
      );
    }

    columnConfigs[boardId] = {
      inputColumnId: inputColumn.id,
      outputColumnId: outputColumn.id,
      lastUpdated: now
    };

    return columnConfigs[boardId];
  } catch (error) {
    throw new BaseError(
      'Failed to get column configuration',
      'GET_COLUMN_CONFIG_FAILED',
      500,
      error
    );
  }
};

export { getColumnConfig }; 
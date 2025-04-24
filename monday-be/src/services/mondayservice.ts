import initMondayClient from 'monday-sdk-js';
import { BaseError } from '@utils/baseError';
import logger from '@utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const DEBOUNCE_DELAY_MS = 500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const OUTPUT_COLUMN_ID = process.env.OUTPUT_COLUMN_ID;
const INPUT_COLUMN_ID = process.env.INPUT_COLUMN_ID;

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const updateOutputColumnValue = async (boardId: string, itemId: string, value: number | null, attempt = 1): Promise<{ success: boolean; error?: string }> => {
  const token = process.env.MONDAY_TOKEN;
  if (!token) {
    throw new BaseError('Monday token not found', 'MONDAY_TOKEN_MISSING', 500);
  }

  const mondayClient = initMondayClient({ token });
  const mondayValue = value === null ? '""' : `"${value}"`;
  
  try {
    logger.info(`Attempt ${attempt} to update column value for item ${itemId}`);
    
    const query = `
      mutation {
        change_simple_column_value(
          item_id: ${itemId},
          column_id: "${OUTPUT_COLUMN_ID}",
          board_id: ${boardId},
          value: ${mondayValue}
        ) {
          id
        }
      }
    `;
    
    const response = await mondayClient.api(query);
    if (response.errors) {
      throw new BaseError(
        `Monday API error: ${response.errors[0].message}`,
        'MONDAY_API_ERROR',
        400,
        response.errors
      );
    }
    
    logger.info('Column update successful:', response);
    return { success: true };
    
  } catch (error) {
    logger.error(`Attempt ${attempt} failed:`, error);
    
    if (attempt < MAX_RETRIES) {
      logger.info(`Retrying in ${RETRY_DELAY_MS}ms...`);
      await sleep(RETRY_DELAY_MS);
      return updateOutputColumnValue(boardId, itemId, value, attempt + 1);
    }
    
    const errorMessage = `Failed to update column after ${MAX_RETRIES} attempts`;
    logger.error(errorMessage);
    return { 
      success: false, 
      error: error instanceof BaseError ? error.message : errorMessage
    };
  }
};

// Create a debounced version of the update function
const debouncedUpdateOutputColumnValue = debounce(updateOutputColumnValue, DEBOUNCE_DELAY_MS);

interface MondayApiResponse {
  data?: any;
  account_id?: number;
  errors?: Array<{ message: string }>;
}

const getColumnValue = async (itemId: string, columnId: string) => {
  const token = process.env.MONDAY_TOKEN;
  if (!token) {
    throw new BaseError('Monday token not found', 'MONDAY_TOKEN_MISSING', 500);
  }
  
  try {
    const mondayClient = initMondayClient();
    mondayClient.setApiVersion('2024-01');
    mondayClient.setToken(token);

    const query = `query($itemId: [ID!], $columnId: [String!]) {
      items (ids: $itemId) {
        column_values(ids:$columnId) {
          value
        }
      }
    }`;
    const variables = { columnId, itemId };
    const response = await mondayClient.api(query, { variables }) as MondayApiResponse;
    
    if (response.errors) {
      throw new BaseError(
        `Monday API error: ${response.errors[0].message}`,
        'MONDAY_API_ERROR',
        400,
        response.errors
      );
    }

    const rawValue = response?.data?.items[0]?.column_values[0]?.value || '';
    return rawValue ? JSON.parse(rawValue) : '';
  } catch (error) {
    throw new BaseError(
      'Failed to get column value',
      'GET_COLUMN_VALUE_FAILED',
      500,
      error
    );
  }
};

const getColumnIds = async (boardId: string) => {
  const token = process.env.MONDAY_TOKEN;
  if (!token) {
    throw new BaseError('Monday token not found', 'MONDAY_TOKEN_MISSING', 500);
  }

  try {
    const mondayClient = initMondayClient();
    mondayClient.setApiVersion('2024-01');
    mondayClient.setToken(token);

    const query = `query($boardId: ID!) {
      boards(ids: [$boardId]) {
        columns {
          id
          title
          type
        }
      }
    }`;

    const response = await mondayClient.api(query, { variables: { boardId } }) as MondayApiResponse;
    
    if (response.errors) {
      throw new BaseError(
        `Monday API error: ${response.errors[0].message}`,
        'MONDAY_API_ERROR',
        400,
        response.errors
      );
    }

    return response.data.boards[0].columns;
  } catch (error) {
    throw new BaseError(
      'Failed to get column IDs',
      'GET_COLUMN_IDS_FAILED',
      500,
      error
    );
  }
};

export { debouncedUpdateOutputColumnValue as updateOutputColumnValue, getColumnValue, getColumnIds }; 
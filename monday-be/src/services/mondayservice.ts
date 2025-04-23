import initMondayClient from 'monday-sdk-js';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const DEBOUNCE_DELAY_MS = 500;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  const mondayClient = initMondayClient({ token });
  
  // For null values, we need to send an empty string to Monday's API
  const mondayValue = value === null ? '""' : `"${value}"`;
  
  try {
    console.log(`Attempt ${attempt} to update column value for item ${itemId}`);
    
    const query = `
      mutation {
        change_simple_column_value(
          item_id: ${itemId},
          column_id: "numeric_mkq9k1d7",
          board_id: ${boardId},
          value: ${mondayValue}
        ) {
          id
        }
      }
    `;
    
    const response = await mondayClient.api(query);
    if (response.errors) {
      throw new Error(`Monday API error: ${response.errors[0].message}`);
    }
    
    console.log('Column update successful:', response);
    return { success: true };
    
  } catch (error: any) {
    console.error(`Attempt ${attempt} failed:`, error);
    
    if (attempt < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS}ms...`);
      await sleep(RETRY_DELAY_MS);
      return updateOutputColumnValue(boardId, itemId, value, attempt + 1);
    }
    
    const errorMessage = `Failed to update column after ${MAX_RETRIES} attempts: ${error.message}`;
    console.error(errorMessage);
    return { 
      success: false, 
      error: errorMessage
    };
  }
};

// Create a debounced version of the update function
const debouncedUpdateOutputColumnValue = debounce(updateOutputColumnValue, DEBOUNCE_DELAY_MS);

const getColumnValue = async (itemId: string, columnId: string) => {
  try {
    const token = process.env.MONDAY_TOKEN;
    if (!token) {
      throw new Error('MONDAY_TOKEN is not defined');
    }
    
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
    const response = await mondayClient.api(query, { variables });
    const rawValue = response?.data?.items[0]?.column_values[0]?.value || '';
    return rawValue ? JSON.parse(rawValue) : '';
  } catch (err) {
    console.error('Error getting column value:', err);
    throw err;
  }
};

export { debouncedUpdateOutputColumnValue as updateOutputColumnValue, getColumnValue }; 
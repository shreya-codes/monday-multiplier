import { getMultiple } from "./calculationService";
import { upsertItem } from "./itemService";
import { addHistory } from "./historyService";
import { updateOutputColumnValue } from "./mondayservice";

interface InputChangeControllerProps {
    boardId: string;
    pulseId: string;
    value: {
        value: string;
      };
  }

  const validateAndParseInput = async (value: string) => {
    const inputValue = value;

    if (!inputValue) {
        throw new Error("Input value is required");
    }
    const parsedInput = parseFloat(inputValue);
    if (isNaN(parsedInput)) {
        throw new Error("Invalid input value: not a number");
    }   
    return parsedInput;
  }

  const processInputChange = async ({boardId,pulseId,value}: InputChangeControllerProps) => {
    try {
        // Case: input column is removed => value is null
        if (value === null) {
            console.log("Input is null or invalid. Clearing output...");
            await updateOutputColumnValue(boardId, pulseId, null);
            return
        }
        
        const parsedInput = await validateAndParseInput(value.value) ;
        const item = await upsertItem({
            itemId: pulseId,
            input: parsedInput,
        });
    const factor = item && item.factor ? item.factor : 1;
    const result = getMultiple(parsedInput, factor);
   
        await addHistory(pulseId, {
            itemId: pulseId,
            factor: factor,
            input: parsedInput,
            output: result,
            createdAt: new Date()
        });
    await updateOutputColumnValue(boardId, pulseId, result);
    return item;
} catch (error) {
    console.error('Error in processInputChange:', error);
    throw error;
}
}

export { processInputChange };
import { getMultiple } from "@services/calculationService";
import { upsertItem } from "@services/itemService";
import { addHistory } from "@services/historyService";
import { updateOutputColumnValue } from "@services/mondayservice";

import { BaseError } from "@utils/baseError";
import logger from "@utils/logger";

import { InputChangeProps } from "@/types/updateColumnParams";

const validateAndParseInput = async (value: string): Promise<number> => {
    const inputValue = value;

    if (!inputValue) {
        throw new BaseError("Input value is required", "INPUT_VALUE_REQUIRED", 400  );
    }
    const parsedInput = parseFloat(inputValue);
    if (isNaN(parsedInput)) {
        throw new BaseError("Invalid input value: not a number", "INVALID_INPUT_VALUE", 400);
    }
    return parsedInput;
}

const processInputChange = async ({ boardId, pulseId, value }: InputChangeProps) => {
    try {
        // Case: input column is removed => value is null
        if (value === null) {
            logger.info("Input is null or invalid. Clearing output...");
            await updateOutputColumnValue(boardId, pulseId, null);
            return {
                success: true,
                message: "Output column cleared successfully"
            }
        }

        const parsedInput = await validateAndParseInput(value.value);
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
        return {
            success: true,
            message: "Output column updated successfully",
            data: item
        }
    } catch (error) {
        throw new BaseError("Failed to process input change", "PROCESS_INPUT_CHANGE_FAILED", 500, error);
    }
}

export { processInputChange };
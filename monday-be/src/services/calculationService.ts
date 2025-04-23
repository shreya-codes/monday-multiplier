import { BaseError } from "@/utils/baseError";

const getMultiple = (value: number, factor: number) => {
    try {
        return Math.round(value * factor * 100) / 100;
    } catch (error) {
        throw new BaseError("Failed to calculate multiple", "CALCULATE_MULTIPLE_FAILED", 500, error);
    }
};

export { getMultiple };
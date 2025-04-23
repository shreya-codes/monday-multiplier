const getMultiple = (value: number, factor: number) => {
    try {
        return Math.round(value * factor * 100) / 100;
    } catch (error) {
        return 0;
    }
};

export { getMultiple };
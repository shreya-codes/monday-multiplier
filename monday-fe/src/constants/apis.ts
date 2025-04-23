const getItemHistoryUrl = (itemId: string) => {
    return `/items/${itemId}/history`;
}

const getItemUrl = (itemId: string) => {
    return `/items/${itemId}`;
}

const updateFactorUrl = (itemId: string) => {
    return `/items/${itemId}/factor`;
}

export { getItemHistoryUrl, getItemUrl, updateFactorUrl }; 
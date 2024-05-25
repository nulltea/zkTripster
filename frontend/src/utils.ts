
const formatEthAmount = (value: string): string => {
    // Remove any non-numeric characters except the decimal point
    let formattedValue = value.replace(/[^0-9.]/g, '');

    // Ensure there is only one decimal point
    const parts = formattedValue.split('.');
    if (parts.length > 2) {
        formattedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit to 18 decimal places
    if (parts[1]) {
        formattedValue = parts[0] + '.' + parts[1].slice(0, 18);
    }

    return formattedValue;
};

export {formatEthAmount}
// Add your utility functions here
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Add a default export
const utils = {
    formatDate,
    formatCurrency
};

export default utils;

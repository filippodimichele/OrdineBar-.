const DISCOUNT_CODE = "BAR10";
const DISCOUNT_PERCENTAGE = 10;

export function validateDiscountCode(code: string): boolean {
    return code.trim().toUpperCase() === DISCOUNT_CODE;
}

export function calculateDiscount(total: number): number {
    return Math.round(total * DISCOUNT_PERCENTAGE) / 100;
}

export function calculateDiscountedTotal(
    total: number,
    discount: number
): number {
    return Math.max(0, total - discount);
}
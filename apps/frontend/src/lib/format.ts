/**
 * Formats a credit amount for display, defaulting missing/null values to 0.
 */
export function formatCredits(value: number | null | undefined) {
    return (value ?? 0).toLocaleString()
}

/**
 * The API currently returns this field as `credisConsumed` (not `creditsConsumed`).
 * Reading it through this helper means that if/when the backend field gets
 * renamed, only this one line needs to change instead of every page.
 */
export function getCreditsUsed(key: { credisConsumed?: number | null }) {
    return key.credisConsumed ?? 0
}

/**
 * Masks an API key, showing only the first 12 characters unless revealed.
 */
export function maskApiKey(apiKey: string, revealed: boolean) {
    if (revealed) return apiKey
    return `${apiKey.slice(0, 12)}${"•".repeat(8)}`
}

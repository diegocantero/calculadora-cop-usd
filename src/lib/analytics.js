/**
 * Sends a custom GA4 event. Only actions are tracked, never salaries or rates,
 * so no personal financial data leaves the browser.
 * Silently does nothing if the GA tag is blocked or not loaded.
 *
 * @param {string} eventName - Snake_case event name, e.g. 'copy_result'.
 * @param {Object} [params={}] - Non-sensitive event parameters.
 */
export function track(eventName, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    // Analytics must never break the calculator.
  }
}

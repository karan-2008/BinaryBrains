/**
 * Color utilities for WSI-based visual indicators.
 *
 * Returns CSS class names based on Water Stress Index thresholds.
 */

/**
 * Get a CSS color class based on WSI value.
 * @param {number} wsi - Water Stress Index (0–100).
 * @returns {string} Tailwind CSS class name.
 */
export const getWsiColorClass = (wsi) => {
  if (wsi > 70) return "wsi-critical"; // Red
  if (wsi > 40) return "wsi-moderate"; // Yellow/Orange
  return "wsi-safe"; // Green
};

/**
 * Get inline style color for WSI badge.
 * @param {number} wsi - Water Stress Index (0–100).
 * @returns {string} Hex color string.
 */
export const getWsiColor = (wsi) => {
  if (wsi > 70) return "#ef4444"; // Red
  if (wsi > 40) return "#f59e0b"; // Amber
  return "#22c55e"; // Green
};

/**
 * Get human-readable WSI severity label.
 * @param {number} wsi - Water Stress Index (0–100).
 * @returns {string} Severity label.
 */
export const getWsiLabel = (wsi) => {
  if (wsi > 70) return "Critical";
  if (wsi > 40) return "Moderate";
  return "Safe";
};

/**
 * Backend API Client
 *
 * Centralized Axios instance for all backend API calls.
 * Base URL points to the FastAPI backend at localhost:8000.
 */

import axios from "axios";

const backendClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000, // 30s timeout (AI insight calls may be slow)
  headers: {
    "Content-Type": "application/json",
  },
});

// -----------------------------------------------------------------------
// Village endpoints
// -----------------------------------------------------------------------

/**
 * Fetch all villages with computed WSI and priority scores.
 * @returns {Promise<Array>} Sorted list of village status objects.
 */
export const fetchVillagesStatus = async () => {
  const response = await backendClient.get("/api/villages/status");
  return response.data;
};

/**
 * Fetch AI-generated insight for a specific village.
 * @param {string} villageId - The village ID.
 * @param {string} lang - Response language (default: "english").
 * @returns {Promise<Object>} Insight response with 3-bullet advisory.
 */
export const fetchVillageInsight = async (villageId, lang = "english") => {
  const response = await backendClient.get(
    `/api/villages/${villageId}/insight`,
    { params: { lang } }
  );
  return response.data;
};

// -----------------------------------------------------------------------
// Tanker endpoints
// -----------------------------------------------------------------------

/**
 * Fetch the computed tanker allocation plan.
 * @returns {Promise<Object>} Allocation plan with village-tanker assignments.
 */
export const fetchTankerAllocation = async () => {
  const response = await backendClient.get("/api/tankers/allocation");
  return response.data;
};

export default backendClient;

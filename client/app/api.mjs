import { getErrorMessage } from "./i18n.mjs";
import { getStoredToken } from "./auth.mjs";

export async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getStoredToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch {
    throw new Error(getErrorMessage("network_error"));
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      isJson && data && typeof data === "object"
        ? (data.message || getErrorMessage(data.error || "request_failed"))
        : getErrorMessage("request_failed");

    throw new Error(message);
  }

  return data;
}

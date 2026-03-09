import { getErrorMessage } from "./i18n.mjs";

export async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(getErrorMessage("network_error"));
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const msg =
      isJson && data && typeof data === "object"
        ? (data.message || getErrorMessage(data.error || "request_failed"))
        : getErrorMessage("request_failed");

    throw new Error(msg);
  }

  return data;
}

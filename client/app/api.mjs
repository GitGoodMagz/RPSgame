export async function apiRequest(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const msg =
      isJson && data && typeof data === "object"
        ? (data.error || "request_failed")
        : "request_failed";
    throw new Error(msg);
  }

  return data;
}

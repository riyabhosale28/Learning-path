const BASE_URL = "http://localhost:4000/api";

export async function api(endpoint, method = "GET", body) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method, // ✅ FIXED
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: method !== "GET" ? JSON.stringify(body) : undefined, // ✅ FIXED
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Request failed");
  }


  return res.json();
}

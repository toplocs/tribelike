export const bufferEncode = (value) => {
  const binary = String.fromCharCode(...new Uint8Array(value));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const bufferDecode = (value) => {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(value.length + (4 - (value.length % 4)) % 4, "=");
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
};

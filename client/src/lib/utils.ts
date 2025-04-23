export const bufferDecode = (value) => Uint8Array.from(atob(value), c => c.charCodeAt(0));

export const bufferEncode = (value) => btoa(String.fromCharCode(...new Uint8Array(value)));
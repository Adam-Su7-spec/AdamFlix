// Central API base URL used by client-side fetch calls.
// Use Vite environment variable VITE_API_BASE so dev/production can differ.
// Falls back to https://onrender.com if the variable is not provided.
export const API_BASE: string = (import.meta.env && import.meta.env.VITE_API_BASE) ? String(import.meta.env.VITE_API_BASE) : "https://onrender.com";

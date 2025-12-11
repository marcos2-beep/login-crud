const rawApiUrl = process.env.EXPO_PUBLIC_API_URL || "https://basic-hono-api.borisbelmarm.workers.dev";

// Normaliza para evitar barras finales dobles ("https://..../" + "/ruta")
export const API_URL = rawApiUrl.replace(/\/+$/, "");

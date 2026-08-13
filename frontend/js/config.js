/**
 * SG Fashion — Frontend API Configuration
 *
 * LOCAL DEV  (root server.js serves everything on one port):
 *   API_BASE_URL = ''   →  relative paths like /api/v1/products work automatically.
 *
 * VERCEL DEPLOYMENT (frontend & backend are separate Vercel projects):
 *   The frontend vercel.json proxies /api/* to the backend, so relative paths
 *   still work — you do NOT need to change this file.
 *   Just update the "destination" in frontend/vercel.json after deploying the backend.
 */

window.API_BASE_URL = '';

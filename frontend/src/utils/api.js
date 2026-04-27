import { DEMO_BRIEF, DEMO_IMPACT } from "../data/demoData";

const DEMO_MODE = true; // flip to false when backend is ready
const API_BASE = "http://REPLACE_WITH_BACKEND_IP:8080"; // your partner fills this in

const DEMO_CACHE = {
  "/brief/generate": { delay: 2800, response: { success: true, data: DEMO_BRIEF } },
  "/analyze/cost-impact": { delay: 3100, response: { success: true, data: DEMO_IMPACT } },
  "/stack/register": { delay: 1500, response: { success: true, data: { stack_id: "demo-stack-001" } } },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiCall(endpoint, payload = {}) {
  if (DEMO_MODE && DEMO_CACHE[endpoint]) {
    await sleep(DEMO_CACHE[endpoint].delay);
    return DEMO_CACHE[endpoint].response;
  }
  const res = await fetch(API_BASE + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
// API client for communicating with backend

const BASE_URL = ''; // relative to root / proxy

export async function fetchConfigStatus() {
  const res = await fetch(`${BASE_URL}/api/config/status`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch status' }));
    throw new Error(err.error || 'Server error');
  }
  const json = await res.json();
  return json.data;
}

export async function loadEnvConfig(envContent) {
  const res = await fetch(`${BASE_URL}/api/config/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ envContent })
  });
  const json = await res.json().catch(() => ({ error: 'Network response was not JSON' }));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update configuration');
  }
  return json.data;
}

export async function fetchJiraIssue(ticketKeyOrUrl) {
  const encoded = encodeURIComponent(ticketKeyOrUrl);
  const res = await fetch(`${BASE_URL}/api/jira/issue/${encoded}`);
  const json = await res.json().catch(() => ({ error: 'Network response error' }));
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Failed to fetch issue ${ticketKeyOrUrl}`);
  }
  return json.data;
}

export async function generateDocument({ ticketInput, artifactType, notes, model }) {
  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketInput, artifactType, notes, model })
  });
  const json = await res.json().catch(() => ({ error: 'Failed to parse JSON response' }));
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Generation failed');
  }
  return json.data;
}

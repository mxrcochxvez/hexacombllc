"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ApiKeyRow = {
  _id: string;
  name: string;
  keyPrefix: string;
  canPublish: boolean;
  createdAt: number;
  lastUsedAt?: number;
  revokedAt?: number;
};

export function BlogApiKeyManager({ apiKeys }: { apiKeys: ApiKeyRow[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [canPublish, setCanPublish] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const endpoint = "https://hexacombllc.com/api/mcp";
  const config = useMemo(() => JSON.stringify({ mcpServers: { "hexacomb-blog": { url: endpoint, headers: { Authorization: `Bearer ${newKey || "YOUR_API_KEY"}` } } } }, null, 2), [endpoint, newKey]);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/blog/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, canPublish }),
      });
      const data = (await response.json()) as { apiKey?: string; error?: string };
      if (!response.ok || !data.apiKey) throw new Error(data.error || "Could not generate API key.");
      setNewKey(data.apiKey);
      setName("");
      setCanPublish(false);
      router.refresh();
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "Could not generate API key.");
    } finally {
      setPending(false);
    }
  }

  async function revoke(id: string) {
    if (!window.confirm("Revoke this key? Any agent using it will immediately lose access.")) return;
    const response = await fetch(`/api/dashboard/blog/api-keys/${id}`, { method: "DELETE" });
    if (!response.ok) setError("Could not revoke the key.");
    router.refresh();
  }

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <section className="dash-card mt-8" aria-labelledby="mcp-heading">
      <h2 id="mcp-heading" className="dash-section-title">Agent access (MCP)</h2>
      <p className="dash-muted mb-4">Generate a revocable key, then paste the configuration into any agent that supports remote MCP servers.</p>
      <form onSubmit={(event) => void generate(event)}>
        <div className="dash-grid">
          <div className="form-group">
            <label htmlFor="keyName">Key name</label>
            <input id="keyName" required placeholder="Content agent" value={name} onChange={(event) => setName(event.target.value)} disabled={pending} />
          </div>
          <label className="dash-check blog-key-permission">
            <input type="checkbox" checked={canPublish} onChange={(event) => setCanPublish(event.target.checked)} disabled={pending} />
            <span><strong>Allow publishing</strong><br /><small>Leave off to let this agent create and edit drafts only.</small></span>
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Generating…" : "Generate API key"}</button>
      </form>
      {error ? <p className="field-error mt-3" role="alert">{error}</p> : null}
      {newKey ? (
        <div className="blog-key-reveal mt-6" role="status">
          <strong>Copy this key now — it will not be shown again.</strong>
          <div className="blog-copy-row"><code>{newKey}</code><button className="btn btn-secondary" type="button" onClick={() => void copy(newKey)}>Copy key</button></div>
          <p className="dash-muted mt-4">MCP configuration</p>
          <div className="blog-copy-row blog-copy-row--config"><pre>{config}</pre><button className="btn btn-secondary" type="button" onClick={() => void copy(config)}>Copy config</button></div>
          <p className="dash-muted mt-3">Or tell your agent: “Connect to <code>{endpoint}</code> with this key as a Bearer token.”</p>
        </div>
      ) : null}
      {apiKeys.length ? (
        <div className="dash-table-wrap mt-6">
          <table className="dash-table">
            <thead><tr><th>Name</th><th>Key</th><th>Permission</th><th>Last used</th><th /></tr></thead>
            <tbody>{apiKeys.map((key) => (
              <tr key={key._id}>
                <td>{key.name}</td><td><code>{key.keyPrefix}</code></td><td>{key.canPublish ? "Draft + publish" : "Drafts only"}</td>
                <td>{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : "Never"}</td>
                <td>{key.revokedAt ? "Revoked" : <button className="btn btn-secondary" type="button" onClick={() => void revoke(key._id)}>Revoke</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

# Agent Readiness Plan — https://nguyenvanlamm.github.io/coin-cubby-site/

**Baseline:** 2/5 (Bot-Aware) — 4 pass, 12 fail, 6 neutral
**Scanner:** isitagentready.com · scanned 2026-10-14T07:04:14.223Z
**Verify with:** re-scan — `curl -sS -X POST https://isitagentready.com/api/scan -H 'Content-Type: application/json' -d '{"url":"https://nguyenvanlamm.github.io/coin-cubby-site/"}'`

Each task closes exactly one failing check. The scanner is the only source: descriptions are its own fix prompts, and every task is verified by re-scanning, not by inspection.

## Phase P0 — Reach the next readiness level

**Goal:** close 1 failing check in this area · **Milestone M0:** re-scan reports level 3 (Agent-Readable) or higher

### Sprint P0 — Reach the next readiness level

#### Task 0.1: Support Accept: text/markdown content negotiation for machine-readable content

**Description**: Implement content negotiation so requests with Accept: text/markdown return a markdown representation while HTML remains the default for browsers. Implementation guide: https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
**Closes**: — (milestone-enabling: M0)
**Dependencies**: None
**Effort**: M
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.contentAccessibility.markdownNegotiation.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.contentAccessibility.markdownNegotiation.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

## Phase P1 — Discoverability and content access

**Goal:** close 2 failing checks in this area · **Milestone M1:** re-scan reports every discoverability and content-accessibility check as pass

### Sprint P1 — Discoverability and content access

#### Task 1.1: Publish DNS for AI Discovery (DNS-AID) SVCB/HTTPS records for DNS-based agent discovery

**Description**: Publish DNS for AI Discovery (DNS-AID) ServiceMode SVCB or HTTPS records under _agents with DNSSEC validation enabled. Implementation guide: https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
**Closes**: — (milestone-enabling: M1)
**Dependencies**: None
**Effort**: L
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discoverability.dnsAid.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/dns-aid/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discoverability.dnsAid.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 1.2: Include Link response headers for agent discovery (RFC 8288)

**Description**: Add Link response headers to your homepage pointing to API docs, catalogs, or machine-readable descriptions. Implementation guide: https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
**Closes**: — (milestone-enabling: M1)
**Dependencies**: None
**Effort**: M
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discoverability.linkHeaders.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/link-headers/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discoverability.linkHeaders.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

## Phase P3 — Agent, API and auth discovery

**Goal:** close 9 failing checks in this area · **Milestone M3:** re-scan reports every discovery check as pass

### Sprint P3 — Agent, API and auth discovery

#### Task 3.1: Publish an A2A Agent Card for agent-to-agent discovery

**Description**: Serve an A2A Agent Card at /.well-known/agent-card.json with your agent name, version, supported interfaces, capabilities, and skills. Implementation guide: https://isitagentready.com/.well-known/agent-skills/a2a-agent-card/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.a2aAgentCard.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/a2a-agent-card/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.a2aAgentCard.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.2: Publish an agent skills discovery index

**Description**: Publish a skills index at /.well-known/agent-skills/index.json listing skill names, types, descriptions, URLs, and digests. Implementation guide: https://isitagentready.com/.well-known/agent-skills/agent-skills/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.agentSkills.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/agent-skills/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.agentSkills.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.3: Publish an API catalog for automated API discovery (RFC 9727)

**Description**: Create /.well-known/api-catalog returning application/linkset+json with a "linkset" array listing your APIs and their specs. Implementation guide: https://isitagentready.com/.well-known/agent-skills/api-catalog/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.apiCatalog.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/api-catalog/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.apiCatalog.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.4: Publish an ARD (Agentic Resource Discovery) manifest so agents can discover your site's capabilities (MCP servers, A2A agents, OpenAPI schemas, and more)

**Description**: Serve /.well-known/ai-catalog.json with specVersion, host, and an entries array listing your MCP servers, agents, and skills. Implementation guide: https://isitagentready.com/.well-known/agent-skills/ard/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.ard.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/ard/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.ard.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.5: Publish Auth.md metadata for agent registration

**Description**: Serve /auth.md and advertise agent_auth in OAuth Authorization Server metadata so agents can register securely. Implementation guide: https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.authMd.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/auth-md/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.authMd.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.6: Publish an MCP Server Card for agent discovery

**Description**: Serve an MCP Server Card (SEP-1649) at /.well-known/mcp/server-card.json with serverInfo, transport endpoint, and capabilities. Implementation guide: https://isitagentready.com/.well-known/agent-skills/mcp-server-card/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: S
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.mcpServerCard.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/mcp-server-card/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.mcpServerCard.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.7: Publish OAuth/OIDC discovery metadata so agents can authenticate with your APIs

**Description**: If your site has protected APIs, publish /.well-known/openid-configuration or /.well-known/oauth-authorization-server with your auth server metadata. Implementation guide: https://isitagentready.com/.well-known/agent-skills/oauth-discovery/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: L
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.oauthDiscovery.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/oauth-discovery/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.oauthDiscovery.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.8: Publish OAuth Protected Resource Metadata so agents can discover how to authenticate

**Description**: Publish /.well-known/oauth-protected-resource with your resource identifier and authorization_servers so agents can discover how to authenticate. Implementation guide: https://isitagentready.com/.well-known/agent-skills/oauth-protected-resource/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: M
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.oauthProtectedResource.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/oauth-protected-resource/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.oauthProtectedResource.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

#### Task 3.9: Support WebMCP to expose site tools to AI agents via the browser

**Description**: Implement the WebMCP API by calling document.modelContext.registerTool() for each tool that exposes your site's key actions to AI agents, or annotate existing forms with toolname and tooldescription. Implementation guide: https://isitagentready.com/.well-known/agent-skills/webmcp/SKILL.md
**Closes**: — (milestone-enabling: M3)
**Dependencies**: None
**Effort**: L
**Verify**: re-scan https://nguyenvanlamm.github.io/coin-cubby-site/; `checks.discovery.webMcp.status` is `pass`
**Acceptance Criteria**:
- [ ] Implementation follows the guide at https://isitagentready.com/.well-known/agent-skills/webmcp/SKILL.md
- [ ] Re-scanning https://nguyenvanlamm.github.io/coin-cubby-site/ reports `checks.discovery.webMcp.status` as `pass`
- [ ] The change is live on https://nguyenvanlamm.github.io/coin-cubby-site/, not only in a preview or staging environment

## Milestones

| ID | Phase | Exit condition | Verify with |
|---|---|---|---|
| M0 | P0 | re-scan reports level 3 (Agent-Readable) or higher | re-scan https://nguyenvanlamm.github.io/coin-cubby-site/ |
| M1 | P1 | re-scan reports every discoverability and content-accessibility check as pass | re-scan https://nguyenvanlamm.github.io/coin-cubby-site/ |
| M3 | P3 | re-scan reports every discovery check as pass | re-scan https://nguyenvanlamm.github.io/coin-cubby-site/ |

**Critical path:** 0.1 → 1.1 → 1.2 → 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → …

## Deferred and out of scope

| Check | Severity | Why deferred | Revisit when |
|---|---|---|---|
| webBotAuth | low | Web Bot Auth directory not found (informational only) — reported as neutral, not a failing check | the scanner reports it as a failing check |
| x402 | low | x402 payment protocol not detected (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| mpp | low | MPP payment discovery not detected (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| ucp | low | UCP profile not found (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| acp | low | ACP discovery document not found (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |
| ap2 | low | AP2 not detected (no A2A Agent Card) (not a commerce site) — the scanner detected no commerce signals on this site | the site starts selling to agents |

**Already passing (4):** `robotsTxt`, `sitemap`, `robotsTxtAiRules`, `contentSignals`

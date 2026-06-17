---
lang: en
layout: post
permalink: /attack-surface
title: "Agentic Recon: When AI Agents Become a Discoverable Attack Surface"
description: "Exposed AI agents are no longer just chatbots: they are connected, tool-enabled applications that can sometimes be discovered from the Internet. A new offensive reconnaissance discipline is emerging to identify, map, and exploit their capabilities."
author: cedric
date: 2026-06-17 09:27:35 +0300
tags: [agentic, ai, threat, reconnaissance, attack-surface, mcp, owasp]
image: '/images/attack-surface.jpeg'
featured:
---

# Agentic Recon: When AI Agents Become a Discoverable Attack Surface

The next major AI attack surface may not be the model itself. It may be the growing population of **exposed AI agents**: poorly inventoried, connected to enterprise tools, sometimes published too broadly, and predictable enough to be discovered at scale.

Over the past two years, generative AI security has largely focused on **prompt injection**, data leakage, and hallucinations. These risks still matter. But the arrival of AI agents changes the dynamic: an agent is not just a conversational interface. It is an application capable of observing, planning, using tools, querying knowledge sources, and sometimes executing actions.

The question is no longer only: *can the model be manipulated?*  
It becomes: **can the agent be found, can its capabilities be understood, can its tools be mapped, and can it then be used as an entry point?**

That is precisely the issue highlighted by Zenity Labs in its article **“Agentic Recon: Discovering and Mapping Public AI Agents”**, which introduces the concept of **agentic recon**: a reconnaissance method focused on discovering publicly deployed AI agents and inferring their exposed capabilities — tools, integrations, knowledge sources, middleware, authentication settings, and deployment patterns.

## AI agents are not chatbots: they are applications

A chatbot answers. An agent acts.

That difference is fundamental for cybersecurity. An AI agent may be connected to:

- internal knowledge bases;
- SaaS tools;
- business APIs;
- databases;
- approval workflows;
- ticketing systems;
- cloud environments;
- MCP connectors;
- non-human identities or service accounts.

In the traditional model, an application exposes routes, APIs, forms, parameters, endpoints, and identities. In the agentic model, it also exposes **capabilities**: search, summarize, send, trigger, modify, query, create, delete, approve, call a tool.

This is why AI agents must be analyzed as **tool-enabled applications**, not as simple conversations with an LLM.

Zenity captures this shift well: if an attacker can discover an agent, they can often infer what it can do, what it has access to, and how to discover similar agents by relying on platform patterns, naming conventions, insecure defaults, and cloud resource enumeration.

This is where agentic recon begins.

## What is agentic recon?

**Agentic recon** is a form of reconnaissance specialized in discovering and mapping AI agents.

It tries to answer very concrete questions:

- Which agents are exposed?
- Which platform are they built on?
- Are they public, semi-public, or protected?
- Which tools can they invoke?
- Which knowledge sources can they access?
- Which integrations or middleware do they use?
- Which authentication mechanisms protect their actions?
- Which patterns can be used to find other similar agents?
- Which metadata reveals the tenant, environment, or underlying technology?

This discipline is close to web content discovery, cloud reconnaissance, API reconnaissance, and attack surface management. But it adds a new layer: mapping the system’s **action logic**.

In a traditional web application, discovering an `/admin` endpoint or an undocumented API is already valuable. In an agentic system, discovering that an agent can send emails, query a CRM, or call an exposed MCP tool may be far more significant.

The attacker is not only looking for a server. They are looking for a **software actor** with privileges.

## What Zenity’s Copilot Studio case shows

Zenity’s article uses **Microsoft Copilot Studio** as a case study. The important point is not that Copilot Studio is unique or exceptionally vulnerable. The important point is that a modern agentic platform creates artifacts, URLs, metadata, conventions, and resources that can be observed and correlated.

Zenity explains that it discovered **tens of thousands of Copilot Studio bots**, including publicly accessible agents with business-impactful tools or knowledge sources.

The described method relies on a classic offensive reconnaissance principle: large-scale platforms generate patterns. Those patterns can then be used to discover similar resources.

In an agentic context, these patterns may involve:

- the structure of public URLs;
- tenant or environment identifiers;
- naming conventions;
- publishing endpoints;
- exposed metadata;
- integration parameters;
- resources linked to agents;
- adjacent cloud components;
- connectors and middleware.

What makes this approach particularly interesting is that it does not start with prompt injection. It starts with **mapping**.

Before manipulating an agent, one must know that it exists. Before abusing a tool, one must know that the tool is available. Before targeting a knowledge source, one must know that it is connected.

Agentic recon therefore becomes the logical first step in an attack chain against agentic AI systems.

## From OSINT to capability mapping

Traditional reconnaissance can discover domains, subdomains, ports, technologies, buckets, APIs, and identities. Agentic recon adds another dimension: the **operational intent of the system**.

An exposed agent can reveal or suggest:

- its business role;
- the department using it;
- the data it queries;
- the tools it can call;
- the actions it can trigger;
- the workflows it participates in;
- the human or technical controls around it.

This is a major difference. In many cases, an agent’s name, description, or visible configuration can be enough to indicate its value.

An agent named “HR Onboarding Assistant,” “Finance Approval Bot,” “Customer Refund Agent,” or “Internal Knowledge Copilot” does not have the same offensive value as a generic chatbot. Even without immediate exploitation, discovering it can help prioritize targets.

That is why agentic recon should not be treated as a research curiosity. It is a natural extension of external attack surface management.

## Agents are discoverable because they rely on platforms

One of Zenity’s most important messages is this: to discover agents, you often need to start by understanding the platform that hosts them.

This may include:

- Microsoft Copilot Studio;
- Azure AI Foundry;
- AWS Bedrock AgentCore;
- open-source agent frameworks;
- LLM gateways;
- OpenAI-, Gemini-, or Anthropic-compatible proxies;
- MCP servers;
- low-code/no-code tools;
- SaaS connectors;
- orchestration middleware.

Each platform has artifacts. Each framework has signatures. Each middleware layer has endpoints, headers, schemas, errors, and default behaviors.

In other words, the attack surface is not only “the agent.” It includes everything that allows the agent to exist, be published, receive requests, call tools, and integrate with the enterprise.

This is where advanced reconnaissance methods become powerful: an attacker can combine weak signals to build an exploitable map.

## Attacks are already starting with AI deployment scanning

Zenity also published an analysis of scanning campaigns targeting AI deployments and middleware. The analysis builds in particular on GreyNoise observations between October 2025 and January 2026.

The key point: attackers are not necessarily trying to “hack OpenAI” or “attack Claude.” They are probing the layer that enterprises operate themselves:

- AI gateways;
- LLM proxies;
- agent backends;
- OpenAI-, Gemini-, or Anthropic-compatible wrappers;
- orchestration middleware;
- self-hosted runtimes;
- exposed model endpoints;
- poorly protected experimental services.

This shift matters. Major model platforms are generally better protected than the internal integrations quickly assembled to accelerate AI adoption. Yet those integrations are often the ones with the most interesting access: internal documents, business systems, cloud tools, databases, and application identities.

The observed reconnaissance therefore aims to identify where the enterprise has deployed its own AI layer — often more fragile than the underlying model provider.

## MCP: the tool layer becomes a discovery surface

The **Model Context Protocol (MCP)** is a perfect illustration of this new risk.

MCP allows AI agents or assistants to connect to external tools and data sources through a standardized interface. It is useful, powerful, and likely to become structurally important in the agentic ecosystem. But as soon as an MCP server is exposed without strong authentication, it becomes an obvious target.

Knostic published a study on mapping Internet-exposed MCP servers. The researchers reported identifying **1,862 exposed MCP servers**, then manually verifying a sample of 119 servers. According to their analysis, all 119 verified servers exposed their internal tool lists without authentication.

This matters because the tool list is the agentic equivalent of asking: **“What can you do?”**

Even without calling a dangerous tool, simply obtaining a list of capabilities can reveal:

- internal integrations;
- database names;
- available operations;
- connected cloud services;
- read or write capabilities;
- potentially destructive actions;
- poorly managed secrets or configuration clues.

Knostic describes a discovery methodology combining Shodan, custom Python tooling, and several fingerprinting signals: JSON-RPC behavior, common MCP endpoints, Server-Sent Events, framework headers such as Uvicorn, and responses to protocol-compliant handshakes.

This is not a marginal technical detail. It shows that the agent tool layer is itself discoverable, fingerprintable, and mappable.

## When MCP exposure becomes a cloud risk

Trend Micro goes further in its analysis of exposed MCP servers. According to its research, the number of exposed MCP servers it observed nearly tripled, increasing from **492** to **1,467** across its scans.

More concerningly, the risk is not limited to data exposure. Trend Micro describes cases where MCP servers linked to AWS or Azure can become vectors for cloud infrastructure compromise, particularly when they involve:

- secrets stored in cleartext;
- exposed or poorly protected `.env` files;
- JSON configurations containing sensitive information;
- cloud commands accessible through MCP tools;
- lack of authentication;
- lack of encryption;
- command injection in unofficial implementations.

This scenario is exactly what makes AI agents dangerous: the attacker is not merely targeting a model response. They are targeting the full agentic chain: agent → tool → identity → cloud → data.

In a traditional environment, a cloud misconfiguration is already critical. In an agentic environment, it can become even more accessible through a natural-language interface or through a poorly controlled tool layer.

## How OWASP helps categorize this threat

The OWASP Top 10 for LLM Applications 2025 and the OWASP Top 10 for Agentic Applications 2026 are useful for structuring this risk.

In the context of agentic recon, several OWASP categories naturally chain together.

### LLM01 — Prompt Injection

Prompt injection remains central, but it often comes after reconnaissance. Once an exposed agent is discovered, the attacker can attempt to manipulate its instructions through:

- direct interaction;
- a document retrieved through RAG;
- a web page accessed by the agent;
- an email processed automatically;
- an entry in a knowledge base;
- third-party content used as context.

Agentic recon then helps select the targets where prompt injection could have real impact.

### LLM06 — Excessive Agency

Excessive agency becomes much more dangerous when an agent is exposed or discoverable. An agent that can only answer FAQs has limited impact. An agent that can call tools, send messages, modify data, or interact with a CRM introduces operational risk.

The technical question becomes: **which actions can the agent perform without strong validation?**

### ASI02 — Tool Misuse & Exploitation

In agentic systems, tools are the execution surface. A tool that is poorly described, overly permissive, unauthenticated, or exposed through MCP can be misused.

Agentic recon is precisely what makes it possible to map these tools, their names, their descriptions, their parameters, and sometimes their potential effects.

### ASI03 — Agent Identity & Privilege Abuse

An agent often acts with an identity: a service account, an OAuth token, a SaaS integration, a cloud role, or delegated user permissions. If that identity is overly permissive, the agent becomes an indirect privilege abuse path.

Reconnaissance therefore aims to understand not only *what the agent knows*, but also **on whose behalf it acts**.

### ASI06 — Memory & Context Poisoning

If an agent uses persistent memory or modifiable knowledge sources, an attacker may try to influence its future decisions. Discovering exposed knowledge sources then becomes a key step.

An agent that consults attacker-manipulable content can be compromised even if the model or main application is not technically “exploited.”

### ASI05 — Unexpected Code Execution

As soon as an agent or MCP server enables command execution, code generation, or interaction with a runtime, the risk changes category. This is no longer only about data leakage or incorrect answers. It is about execution.

Examples involving cloud MCP servers show that this boundary can be crossed faster than expected.

## The new agentic kill chain

A typical attack chain can be summarized as follows:

1. **Discovery**  
   Identify exposed agents, AI endpoints, MCP servers, gateways, or middleware.

2. **Fingerprinting**  
   Understand the platform, conventions, headers, routes, schemas, errors, and metadata.

3. **Capability mapping**  
   Infer tools, knowledge sources, integrations, actions, and associated identities.

4. **Prioritization**  
   Identify high-impact agents: finance, HR, customer support, cloud, sensitive data, internal workflows.

5. **Manipulation**  
   Attempt prompt injection, indirect prompt injection, context poisoning, tool abuse, or validation bypass.

6. **Execution or exfiltration**  
   Use the agent or its tool layer to access data, trigger an action, call an API, or pivot toward infrastructure.

This chain resembles a traditional intrusion, but with one new characteristic: part of the attack logic takes place in language, context, and declared capabilities.

## What defenders need to monitor

The defensive response cannot stop at “blocking prompt injection.” AI agents must be treated as exposable assets.

The priority controls are technical.

### 1. Inventory exposed agents

Organizations must be able to answer simple questions:

- Which agents are published?
- Which ones are accessible from the Internet?
- Which ones are accessible without authentication?
- Which tenants, environments, or workspaces host them?
- Which tools and connectors are associated with them?
- Which knowledge sources do they use?
- Which agents are created by business teams outside the traditional SDLC?

Without inventory, agentic recon will often be more mature on the attacker side than on the defender side.

### 2. Reduce public metadata

Apparently harmless metadata can enable large-scale mapping.

Organizations should limit the exposure of:

- agent names;
- overly explicit descriptions;
- environment identifiers;
- tenant information;
- predictable URLs;
- detailed error messages;
- tool schemas;
- capability lists;
- information about knowledge sources.

This is not security by obscurity. It is reducing the raw material available for automated reconnaissance.

### 3. Treat tool lists as sensitive data

In MCP or agentic environments, a tool list is not harmless. It can reveal the functional topology of the organization.

A good practice is to treat tool manifests, capability descriptions, and call schemas as sensitive information.

At a minimum:

- no unauthenticated access to `tools/list`;
- no descriptions containing secrets, internal names, or architecture details;
- no overly permissive schemas;
- no directly exposed destructive tools;
- no tool call without contextual authorization;
- complete logging of calls and denials.

### 4. Treat MCP as a real infrastructure surface

An MCP server should not be exposed like a simple development service.

Expected controls should include:

- strong authentication;
- tool-level authorization;
- network segmentation;
- encryption;
- secret rotation;
- no cleartext secrets in configuration files;
- egress restrictions;
- strict parameter validation;
- tool allowlisting;
- environment separation;
- call supervision;
- anomaly detection.

MCP must be treated as an access gateway to enterprise capabilities.

### 5. Monitor AI reconnaissance patterns

The campaigns described by Zenity and GreyNoise show that attackers are already probing AI endpoints and middleware.

Defense teams should monitor for:

- enumeration of OpenAI-, Gemini-, or Anthropic-compatible endpoints;
- unusual calls to model or agent routes;
- SSRF probes using callback domains;
- attempts to discover MCP servers;
- request spikes on endpoints such as `/mcp`, `/messages`, `/api/mcp`, or equivalents;
- repeated errors indicating fingerprinting;
- requests attempting to list models, tools, or capabilities;
- anonymous access to public agents;
- newly published agents outside approved processes.

The objective is not only to detect exploitation. It is to detect reconnaissance.

### 6. Perform agentic red teaming

Security testing must evolve.

A classic web application test is not enough to cover:

- agent discovery;
- tool mapping;
- indirect attacks through documents;
- RAG abuse;
- MCP manifest leakage;
- abuse of agent permissions;
- escalation through connectors;
- multi-agent attacks;
- memory or context injection.

Agentic red teaming must include a controlled reconnaissance phase: searching for agents the way an attacker would, but within an authorized and defensive scope.

## The weak signal: agents created outside traditional security cycles

One factor amplifies the risk: many agents are created by business teams, using low-code/no-code platforms, without going through traditional development, security review, or change management processes.

That is a strength for innovation. It is also a security risk.

Agents can appear quickly, be widely shared, integrate sensitive documents, call powerful connectors, and remain invisible to security teams.

This is exactly the context in which agentic recon becomes effective: a large number of small assets, created quickly, exposed in inconsistent ways, with reusable platform patterns.

## Conclusion: AI agent discovery is becoming an offensive discipline

AI agents introduce a new phase in AI security. The issue is no longer only whether a model can be manipulated. The issue is whether the organization truly knows which agents it exposes, which tools they can call, and which data they can access.

Agentic recon shows that AI agents can be searched for, fingerprinted, classified, and prioritized like any exposed asset — but with one major difference: their value does not lie only in infrastructure. It lies in their **ability to act**.

The agentic attack surface therefore sits at the intersection of four layers:

1. the model;
2. the context;
3. the tools;
4. the identities.

Organizations that want to deploy AI agents securely should start with a simple but uncomfortable question:

**If an attacker searched for our AI agents from the Internet, what would they discover before we do?**

That is the question agentic recon helps answer. And that is precisely why AI agents must now become part of attack surface management, threat modeling, and technical red teaming.

## References used

- Zenity Labs — *Agentic Recon: Discovering and Mapping Public AI Agents* : https://labs.zenity.io/p/agentic-recon-discovering-and-mapping-public-ai-agents
- Zenity Labs — *Threat Actors Are Already Scanning For Your AI Deployments and Middleware* : https://labs.zenity.io/p/threat-actors-are-already-scanning-for-your-ai-deployments-and-middleware
- Knostic — *Exposing the Unseen: Mapping MCP Servers Across the Internet* : https://www.knostic.ai/blog/mapping-mcp-servers-study
- Trend Micro — *Update on Exposed MCP Servers: The Threat Widens to the Cloud* : https://www.trendmicro.com/vinfo/us/security/news/vulnerabilities-and-exploits/update-on-exposed-mcp-servers-the-threat-widens-to-the-cloud
- OWASP — *Top 10 for LLM Applications 2025* : https://genai.owasp.org/llm-top-10/
- OWASP — *Top 10 for Agentic Applications 2026* : https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026
- MITRE ATLAS : https://atlas.mitre.org

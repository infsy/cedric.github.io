---
lang: en
layout: post
permalink: /clairic-jev-structured-data-better-decisions
title: "Clairic and Jev: structured data for better decisions"
description: "Clairic extracts data, Jev evaluates choices: a practical vulnerability management workflow and the conditions for more predictable automation."
author: cedric
date: 2026-10-28 17:11:11 -0400
tags: [ai, cybersecurity, automation, system-one]
image: '/images/covers/clairic-jev-blog.jpeg'
featured:
---
# Cybersecurity Automation: Combining Clairic and Jev to Structure Data and Decisions

October’s *zero-day* vulnerability disclosures are drawing cybersecurity teams’ attention, with genuine emergencies to address. Amid these developments, another announcement deserves a closer look: Cloudflare’s release of **Clairic**, a “System One” model specialized in structured data extraction. 

It follows TypeSafe’s **Jev**, introduced on September 15, which focuses on structured decision-making. These models address two complementary needs in automation: turning unstructured information into usable data, then evaluating possible actions using that data. This distinction helps explain what Clairic adds alongside Jev, and why combining them can be useful.

---

## Clairic: Extracting Values Rather Than Generating a Response

In its Clairic announcement, Cloudflare describes a “System One” model. One clarification matters: this is not a new general-purpose generative LLM. The model returns typed values without producing a text response token by token. You define the expected fields and their constraints; it returns the corresponding values from the supplied content.

Here are a few examples of possible extractions depending on the document type:
* **For an invoice:** a supplier, an amount, or a due date.
* **For a security advisory:** CVE identifiers, affected products, and fixed versions.

For text fields, Clairic can also return the positions of the relevant passage in the source. Scalar responses include confidence indicators and can return a null value when the information cannot be determined.

An LLM can already produce JSON and, with suitable mechanisms, follow an output schema. Clairic takes a different approach, specializing in typed-value prediction rather than text generation. Cloudflare aims to **reduce the cost and latency** of these repetitive tasks. Actual gains still need to be measured on your own documents.

> **Important:** The model also supports simple calculations, estimates, and forecasts. These uses require a distinction, however: extracting an amount stated in a document and estimating an amount that is absent do not provide the same quality of evidence.

---

## Jev: Evaluating Choices Rather Than Extracting Fields

Jev, introduced by TypeSafe, focuses on structured decision-making. Given an input state, it returns probabilities associated with options defined in advance. In a processing workflow, these options can represent different categories or routing choices.

The difference therefore concerns the expected output:
* **Clairic** returns values (e.g., a date or a version number).
* **Jev** evaluates choices (e.g., routing a case to a team or requesting further review).

Jev can itself receive unstructured content: using Clairic beforehand is not a technical requirement. However, the two approaches are complementary when your process requires both reusable data and controlled decisions. Separating these functions lets you check extracted fields independently of routing logic, then reuse the same data across several processes.

---

## A Possible Application to Vulnerability Management

Suppose a vendor publishes an advisory about a vulnerability in a VPN gateway. You want to identify the affected devices and prepare their remediation without asking an LLM to read the advisory, infer your exposure, and decide the next step on its own. 

> *Note: The following workflow is a proposed architecture to implement, not a native integration between Clairic and Jev.*

### 1. Collection and Extraction (Clairic)
When the advisory arrives, a collector retrieves its text and records its URL and collection date. It sends the text to **Clairic** with predefined fields: CVE identifier, product, affected versions, fixed version, and any workaround. 

The result populates a structured record linked to the source advisory. If no fixed version is stated, the field remains empty and the case is flagged for verification, rather than filling the gap with an assumption.

### 2. Inventory Correlation (Deterministic Script)
A script then compares the extracted product and version ranges with data from your inventory or vulnerability management platform. The comparison follows the product’s versioning rules, rather than relying on similar names. 

For each potentially affected device, the script adds Internet exposure, service criticality, and the responsible team. An unknown version or an ambiguous match triggers verification; it does not justify concluding that the device is unaffected.

### 3. Evaluation and Routing (Jev)
**Jev** then receives this enriched record and evaluates options you have defined, such as:
* “Urgent review by the security team”
* “Remediation during the maintenance cycle”
* “Further analysis”

Its role is to propose a routing choice with associated probabilities, not to discover vulnerable devices or authorize a patch. Your organization’s rules retain priority: an Internet-facing gateway affected by confirmed exploitation may require escalation regardless of the model’s recommendation. If the data is insufficient or the recommendation fails to meet criteria validated during testing, the workflow requests human review.

### 4. Orchestration and Summary (Generative LLM & Human Approval)
Finally, the orchestrator creates or updates a ticket for the responsible team, including affected devices, recorded versions, the advisory link, and the proposed routing. A **generative LLM** can draft the summary from these elements, without adding facts. 

The owner approves the action and its deadline; existing tools handle deployment, then a new scan or version check confirms remediation before the ticket is closed. **Clairic** prepares the data, **Jev** helps route the case, and the software retains execution rules and approvals.

---

## Assessing Reliability Beyond the Output Format

The Cloudflare documentation makes this clear: a value can conform to the requested type and still be incorrect. Confidence scores and uncertainty intervals do not replace validation on your data. Clairic is available in *preview* on Workers AI. Cloudflare also plans to make the model weights accessible, but that release has not yet taken place.

The arrival of these specialized models could help provide something frontier models sorely lack in critical automation: **determinism**, meaning the ability to obtain the same result from the same inputs under identical execution conditions. By separating data extraction with Clairic from choice evaluation with Jev, you can define expected behavior more precisely and test its reproducibility, rather than entrusting the entire process to free-form text generation.

This prospect must be distinguished from an established guarantee: typed outputs and explicit probabilities prove neither deterministic execution nor correct results. A progressive validation approach is recommended:
1. Start with a limited process.
2. Measure extraction and decision errors separately.
3. Check output stability with inputs, model version, and configuration held constant.

Combined with deterministic business rules, Clairic and Jev could make automation more predictable and verifiable, while reserving generative models for tasks that require their flexibility.
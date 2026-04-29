# Vector Workflow Engine

A deterministic, dependency‑aware workflow engine for autonomous LLM agents.  
It transforms high‑level natural‑language plans into **validated**, **optimized**, and **parallelizable** execution graphs — with built‑in **autofix**, **cycle detection**, and **tool‑aware execution**.

This project demonstrates production‑grade engineering patterns for AI‑driven automation.

---

## Why This Project Matters

Modern LLM agents generate plans that are:
- Imperfect  
- Non‑deterministic  
- Sometimes invalid  
- Often inefficient  

This engine solves that by providing:
- **Safety** (validation, required‑field enforcement, cycle detection)  
- **Determinism** (DAG, topological sorting, dependency resolution)  
- **Resilience** (autofix, retries, multi‑step repair)  
- **Performance** (parallel execution groups)   

---

## Core Capabilities

### 1. Validation Layer
Ensures every plan is structurally correct before execution:
- Unknown tool detection  
- Required‑field enforcement  
- Duplicate step detection  
- Full‑plan validation with autofix fallback  

### 2. LLM Autofix System
Automatically repairs:
- Invalid steps  
- Invalid plans  
- Cascading failures  
- Remaining steps after a mid‑plan crash  

Uses strict JSON‑only rewriting to guarantee safety.

### 3. Dependency + DAG Engine
Automatically analyzes step relationships:
- Detects file read/write/update dependencies  
- Builds a Directed Acyclic Graph  
- Extracts cycles  
- Computes parallel layers  
- Performs topological sorting  

### 4. Optimization Pipeline
Improves plan efficiency:
- Removes no‑ops  
- Deduplicates steps  
- Merges redundant writes  
- Reorders steps deterministically  
- Assigns parallel groups  

### 5. Execution Engine
Two execution modes:

#### Parallel Execution
- Groups independent steps  
- Executes each group concurrently  
- Handles autofix + retry logic per step  

#### Sequential Execution
- Deterministic, ordered execution  
- Step‑level and multi‑step autofix  
- Retry support  

---

## Example Usage

```ts
import { executePlan } from "./workflowEngine";

const plan = {
  goal: "Generate and save a report",
  optimize: true,
  parallel: true,
  autofix: true,
  steps: [
    { number: 1, tool: "fileWriterTool", filename: "report.txt", content: "Hello" },
    { number: 2, tool: "fileReaderTool", filename: "report.txt" }
  ]
};

const results = await executePlan(plan);
console.log(results);
```

---

## Architecture Overview

### Subsystems
- **Validation** — structural correctness  
- **Autofix** — LLM‑powered repair  
- **Optimization** — step merging, deduping, DAG ordering  
- **Execution** — parallel + sequential engines  
- **Tooling** — registry‑based tool interface  

### Execution Flow
1. Validate plan  
2. Autofix if invalid  
3. Optimize (optional)  
4. Build DAG  
5. Compute parallel layers  
6. Execute (parallel or sequential)  
7. Return structured results  

---

## Tooling Model

Each tool defines:
- `requiredFields`  
- `handler()`  

The engine:
- Validates required fields  
- Passes arguments in correct order  
- Handles tool‑level errors  
- Supports autofix when tools fail  

---

## Execution Results

Each step returns:
- Step number  
- Description  
- Tool used  
- Parallel group  
- Start/end timestamps  
- Duration  
- Output  
- Error (if any)  
- Autofix metadata  
- Fixed step (if applicable)  

This makes debugging and observability straightforward.

---

## Project Structure

```
workflowEngine.ts         # Full engine (validation, DAG, optimization, execution)
toolRegistry.ts           # Tool definitions + handlers
fileWriterTool.ts
fileReaderTool.ts
fileUpdaterTool.ts
webSearchTool.ts
memoryTool.ts
skipTool.ts
vector.ts                 # System prompt for LLM reasoning
```

---

## What This Project Demonstrates to Employers

- **Systems design**: DAGs, dependency graphs, parallel execution  
- **Error handling**: retries, autofix, multi‑step repair  
- **LLM orchestration**: structured prompting, JSON‑only constraints  
- **Production thinking**: validation, safety, determinism  
- **Code quality**: modularity, readability, clear subsystem boundaries  

This is the kind of project that signals you can handle real engineering challenges — not just toy apps.

---

## Roadmap

- Conditional branching  
- Execution sandboxing  
- Richer dependency heuristics  
- Metrics + tracing hooks  
- Plugin system for custom tools  

---

## License

This project is currently unlicensed and provided for portfolio and educational purposes.

## Context

Users and test engineers need clear instructions on how to use the E-UTRA Maximum Power Reduction (MPR) Limits Calculator, how the dynamic Notes logic functions, and how to operate the tool offline.

## Goals / Non-Goals

**Goals:**
- Provide a clear, structured `README.md` file detailing project overview, features, directory layout, and running instructions.
- Provide a `GUIDE.md` file containing a step-by-step user manual, parameters explanation, and calculation references.

**Non-Goals:**
- Out of scope to write user manuals for CA (Carrier Aggregation) or 5G NR since they are not in the database.

## Decisions

### Decision 1: Documentation Scope & Formatting
- Format: Standard GitHub Flavored Markdown (GFM) files.
- **README.md** scope:
  - Tool Title & Description
  - Core Features (asymmetric tolerances, auto-judgment notes, offline capability)
  - Project File Structure
  - Execution Instructions (launching via file:// protocol vs local server)
- **GUIDE.md** scope:
  - Core parameters reference (Band, Modulation, Allocation, Mode)
  - Detail on Note 1, Note 2, and Note 3 and how they are auto-judged
  - Visualizer and Pass/Fail verification workflow
  - Standard tolerances summary table

## Risks / Trade-offs

*None*

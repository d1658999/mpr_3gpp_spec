## Context

Engineers need a fast, accurate, and visual way to look up and verify E-UTRA (LTE) Maximum Power Reduction (MPR) limits during RF test validation. Following the spec exploration, we successfully automated the extraction of limits for all 51 bands from TS 36.521-1 into a JSON database. This design document defines how we will expose this database through a highly responsive, offline-capable visual calculator, explicitly incorporating the three specification Notes (Note 1, Note 2, Note 3).

## Goals / Non-Goals

**Goals:**
- Provide a zero-dependency, single-page web app (`index.html`) to calculate 3GPP MPR test limits.
- Support offline execution (i.e., double-clicking `index.html` in file explorer should work without CORS or server requirements).
- Present limits clearly with visual gauges (USL, Nominal, LSL) and detail notes (Note 1, Note 2, Note 3).
- Display the configured maximum output power ($P_{CMAX}$) limits and tolerances mapped from Table 6.2.5.3-1 (Note 2).
- Expose the underlying database as a clean JSON structure for external scripts.

**Non-Goals:**
- This initial implementation will exclude 5G NR FR1/FR2 bands (which can be added in a future phase).
- Excludes multi-cluster and carrier aggregation (CA) limits.

## Decisions

### Decision 1: Tech Stack - Vanilla HTML5, CSS3, and JavaScript
- **Alternative considered**: Next.js or React.
- **Rationale**: React or modern frameworks require a dev server and build step. A vanilla HTML/CSS/JS page has zero compile overhead, works instantly in any browser, and is trivial to maintain.
- **Aesthetics**: Vanilla CSS will be styled to professional standards (dark mode, glassmorphic card containers, Outfit/Inter typography, animated transitions, and glowing indicator accents).

### Decision 2: Database Storage - Embedded JavaScript Data File (`mpr_limits_data.js`)
- **Alternative considered**: Loading `mpr_limits.json` via `fetch()`.
- **Rationale**: Browsers enforce strict CORS policies when HTML pages are opened directly from the local filesystem (`file:///` protocol) and block `fetch()` calls. To enable true offline-first, double-click execution, the JSON database will be exported as a JavaScript variable/module in `mpr_limits_data.js`.

### Decision 3: Visual Power Gauge Component
- **Alternative considered**: Text-only results.
- **Rationale**: A visual representation of the transmitter power window (drawn using HTML5 canvas or dynamic CSS bar charts) helps engineers instantly see the allowed margins and how MPR shifts the window.

### Decision 4: Note 2 Configured Power ($P_{CMAX}$) Tolerance Mapping
- **Alternative considered**: Hardcoding tolerances per band.
- **Rationale**: Table 6.2.5.3-1 defines a dynamic tolerance curve where the configured maximum output power tolerance increases as the target output power drops due to higher MPR. We will implement this as a logical mapping function in Javascript:
  - $P_{\text{target}} \ge 21.0$: Tolerance = $\pm 2.0\text{ dB}$
  - $20.0 \le P_{\text{target}} < 21.0$: Tolerance = $+2.5\text{ / }-2.5\text{ dB}$
  - $19.0 \le P_{\text{target}} < 20.0$: Tolerance = $+3.5\text{ / }-3.5\text{ dB}$
  - $18.0 \le P_{\text{target}} < 19.0$: Tolerance = $+4.0\text{ / }-4.0\text{ dB}$
  - $13.0 \le P_{\text{target}} < 18.0$: Tolerance = $+5.0\text{ / }-5.0\text{ dB}$
  - $8.0 \le P_{\text{target}} < 13.0$: Tolerance = $+6.0\text{ / }-6.0\text{ dB}$
  - $P_{\text{target}} < 8.0$: Tolerance = $+7.0\text{ / }-7.0\text{ dB}$
  This maps the exact Core requirements and Conformance test limits for PCMAX under Note 2.

## Risks / Trade-offs

- **[Risk] PDF Spec Updates**: 3GPP updates E-UTRA specifications quarterly, which may introduce new bands or update tolerances.
  - **Mitigation**: The extraction parser `parse_all_mpr_tables_v2.py` is checked into the repository under the scratch folder to allow regenerating the database rapidly.
- **[Risk] Footnote Ambiguity**: Merged table cells in the PDF can occasionally result in misaligned footnote associations during extraction.
  - **Mitigation**: The data pipeline includes cleaning heuristics and validation assertions. Key bands (1, 22, 24, 28, 41) have been manually cross-verified.

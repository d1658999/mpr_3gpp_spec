## Context

Currently, E-UTRA (LTE) Maximum Power Reduction (MPR) relaxations (Note 1 band edge, Note 2 PCMAX Table 6.2.5.3-1, and Note 3 coexistence) can be checked or applied regardless of whether the E-UTRA band and configuration in the E-UTRA test specification TS 36.521-1 support them. The database contains a `footnotes` array for each band configuration denoting which notes apply (e.g. `1` for Note 1, `2` for Note 2, and `3` for Note 3). We need to hook into this metadata to dynamically configure the UI.

## Goals / Non-Goals

**Goals:**
- Dynamically detect Note 1, Note 2, and Note 3 support for any selected Band + Modulation + Allocation combination.
- Update the checkbox control state (disabled, enabled, checked) dynamically.
- Dynamically adjust the Clause 6.2.5 (Configured Power) calculation depending on whether Note 2 is supported in the database footnotes.
- Display visual badges/status text next to the note options so users understand the applicability.

**Non-Goals:**
- We will not modify the underlying JSON database since the `footnotes` metadata already exists.

## Decisions

### Decision 1: Footnote Checking Logic in JavaScript
- We will retrieve `limitsData.footnotes` from the active configuration entry.
- Note 1 (Band-Edge) is supported if `limitsData.footnotes.includes(1)`.
- Note 2 (PCMAX Table 6.2.5.3-1) is supported if `limitsData.footnotes.includes(2)`.
- Note 3 (B18/B26 coexistence) is supported if the band is 18 or 26.
- If Note 1 is not supported, the `note1Checkbox` will be disabled and unchecked.
- If Note 3 is not supported, the `note3Container` will be hidden.

### Decision 2: Note 2 Dynamic Calculations
- Under Clause 6.2.5 Configured Power Mode, we calculate:
  - If `limitsData.footnotes.includes(2)` is `true`: Apply Table 6.2.5.3-1 core tolerance relaxation (e.g. $\pm 2.5\text{ dB}$ for 64QAM Full, $\pm 4.0\text{ dB}$ for 256QAM).
  - If `limitsData.footnotes.includes(2)` is `false`: Use the standard base band tolerance (e.g. $\pm 2.0\text{ dB}$ for Band 1).
- This ensures standard bands without Note 2 don't incorrectly receive configured power tolerance relaxation.

### Decision 3: Note Status Badges in UI
- We will add dynamic label/badge elements (`.note-status-badge`) next to Note options in `index.html`.
- The badges will update text and CSS classes:
  - `status-active` (green): Supported and checkbox is checked.
  - `status-supported` (blue): Supported but not checked.
  - `status-na` (grey): Not applicable to the current configuration.

## Risks / Trade-offs

- **[Risk] User confusion on disabled checkboxes** → *Mitigation*: We will show a tool-tip or a clear badge (e.g., "N/A - Not Applicable") next to disabled checkboxes so the user understands why the option is disabled.

## Context

3GPP TS 38.521-1 defines transmitter maximum output power, Maximum Power Reduction (MPR), and configured output power ($P_{CMAX}$) requirements for 5G NR FR1. The existing E-UTRA (4G LTE) calculator is restricted to E-UTRA bands (TS 36.521-1). To achieve a unified RF verification tool, the calculator must be expanded to dynamically handle 5G NR FR1 parameters.

## Goals / Non-Goals

**Goals:**
- Add 5G NR FR1 calculations supporting Power Classes 1/2/3, DFT-s-OFDM/CP-OFDM waveforms, SCS (15/30/60 kHz), and Channel Bandwidths.
- Implement automated extraction of band capabilities, nominal powers, base tolerances, and Note 3 applicability from the PDF spec into a structured JSON database.
- Keep the application zero-dependency and 100% offline-runnable by double-clicking `index.html`.

**Non-Goals:**
- Multi-Cluster, Carrier Aggregation (CA), or Dual Connectivity (DC) power requirements.
- FR2 (mmWave) operating band support.

## Decisions

- **Automated PDF Parser**: We implemented a python parsing script (`generate_5g_db_from_pdf.py`) using `pdfplumber` to automatically extract the maximum output power test requirements from Table 6.2.1.5-1 (PC3), Table 6.2.1.5-2 (PC2), and Table 6.2.1.5-2a (PC1). This resolves the bands, tolerances, nominal power, and Note 3 support flags. We chose this over manual transcription to guarantee spec alignment and prevent transcription mistakes.
- **JS-Wrapped Database Structure**: To bypass local browser CORS constraints (allowing engineers to run the tool by double-clicking `index.html` from their local file system), we wrapped the generated JSON database as a global variable `MPR_LIMITS_5G_DB` inside `mpr_limits_5g_data.js`.
- **Waveform & Allocation MPR Logic**: The 5G NR FR1 MPR rules are structured under a dynamic calculator function `calculate5G()` in `index.js`. It computes:
  - Base MPR limits for DFT-s-OFDM and CP-OFDM waveforms.
  - TDD BPSK power boosting (Note 1) nominal power scaling (to 26 dBm) and custom MPR offsets.
  - Band-Edge Relaxation (Note 3) by shifting LSL.
  - PC1 Edge allocation dynamic formula using subcarrier spacing and transmission bandwidth config $N_{RB}$ lookup.
  - $\Delta$MPR relative channel bandwidth additions.

## Risks / Trade-offs

- **Risk**: pdfplumber table extraction merging footnote markers (superscripts) into numeric text (e.g. `±(23+TT)` instead of `±(2+TT)` with Note 3).
  - *Mitigation*: The parser script uses specific regex and string analysis rules (e.g., matching `23`, `33`, `3.03` to isolate the base tolerance and map Note 3 support) which has been validated against all 5G bands.
- **Risk**: Browser CORS restrictions block fetching local JSON database files.
  - *Mitigation*: Bundling the database directly in a static `.js` file loaded via a standard `<script>` tag.

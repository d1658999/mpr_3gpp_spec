## Why

RF engineers and validation systems currently rely on manual lookup of the 6,000+ page 3GPP LTE (TS 36.521-1) and 5G NR (TS 38.521-1) specifications to find the exact Upper Specification Limit (USL) and Lower Specification Limit (LSL) for transmitter output power under different Maximum Power Reduction (MPR) settings. This process is time-consuming, prone to human error, and complex due to band-specific exceptions, asymmetric tolerances (e.g., Bands 22, 24, 28), and footnotes (Note 1 band-edge relaxation, Note 2 configured power tolerance limits, and Note 3 B18/B26 coexistence). 

Introducing an automated lookup database and interactive visual calculator will ensure 100% accuracy, speed up testing validation, and act as a reliable source of truth.

## What Changes

- **Add** a structured JSON database (`mpr_limits.json`) containing nominal power classes, base tolerances, allowed MPR, test tolerances, and Table 6.2.5.3-1 configured power tolerances.
- **Add** an interactive web-based Calculator application (`index.html`) using Vanilla HTML5, CSS, and JS that allows users to select a Band, Modulation (QPSK through 256QAM), and RB allocation to calculate USL and LSL limits instantly.
- **Add** spec-defined notes handling to automatically apply relaxations and display conditions for **Note 1** (band-edge -1.5 dB LSL), **Note 2** (configured power limits via Table 6.2.5.3-1 tolerance mapping), and **Note 3** (B18/B26 coexistence -1.5 dB LSL).

## Capabilities

### New Capabilities
- `mpr-calculator`: System to lookup and calculate the exact USL and LSL limits for MPR in 3GPP bands based on user input parameters (Band, Modulation, RB Allocation, and special Note 1, 2, 3 relaxations and conditions).

### Modified Capabilities
*None*

## Impact

- **Web Application**: Introduces a self-contained, offline-first web interface in the codebase.
- **Database**: Adds a structured JSON schema for MPR and PCMAX parameters that can be integrated into automation scripts or other tools.

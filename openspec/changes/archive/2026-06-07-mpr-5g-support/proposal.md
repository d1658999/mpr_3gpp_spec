## Why

Integrate 5G NR FR1 Maximum Power Reduction (MPR) and Configured Power ($P_{CMAX}$) calculation support (per TS 38.521-1) into the existing E-UTRA (4G LTE) limits calculator to create a unified, dual-RAT transmitter conformance validation tool. This solves the need for RF and test validation engineers to manually look up complex 5G waveform/allocation specs and band-edge relaxations on the test bench.

## What Changes

- **Dual-Technology Mode**: Added a Radio Access Technology (RAT) selector allowing users to switch between E-UTRA (4G LTE) and 5G NR FR1.
- **5G Parameter Controls**: Introduced new drop-down selectors for 5G NR FR1 specific inputs: UE Power Class (PC1, PC2, PC3), Waveform Type (DFT-s-OFDM, CP-OFDM), Subcarrier Spacing (15, 30, 60 kHz), Channel Bandwidth (5 to 100 MHz), and Edge Size (1, 2 RBs).
- **Automated Band Specs Database**: Created a python-parsed 5G NR FR1 operating bands database (`mpr_limits_5g.json` and `mpr_limits_5g_data.js`) populated directly from TS 38.521-1 Tables 6.2.1.5-1/2/2a to automatically resolve nominal powers, upper/lower tolerances, and Note 3 applicability per band.
- **5G Spec Rule Logic**:
  - Note 1 (TDD BPSK Power Boosting): Boosts nominal power to 26 dBm and applies modified MPR limits for PC3 DFT-s-OFDM $\pi/2$ BPSK on TDD bands (n40, n41, n77, n78, n79).
  - Note 3 (Band Edge Relaxation): Automatically reduces LSL by 1.5 dB for supported band/power class combinations at channel edges.
  - PC1 Edge MPR Formula: Automatically calculates Edge MPR dynamically using $L_{CRB} / N_{RB}$ formulas based on SCS and channel bandwidth.
  - $\Delta$MPR: Automatically adds relative bandwidth MPR offset (+0.5 dB for n28/30-40MHz or +1.0 dB for n40/100MHz) according to Table 6.2.2.3-3.
- **Configured Power Mode**: Added $P_{CMAX}$ tolerance mapping (Table 6.2.4.3-2) matching the 5G NR FR1 configured power limits.
- **User Documentation**: Updated `README.md` and `GUIDE.md` to cover 5G NR FR1 configuration, formulas, and visualizer guide.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `mpr-calculator`: Extend the calculator to support 5G NR FR1 band configurations, waveforms, subcarrier spacing, edge size selections, and the corresponding maximum power reduction, band-edge relaxation, and configured power tolerance rules.

## Impact

- `index.html`: Modified to include the RAT selector, 5G controls layout, and a reference to the new 5G limits database.
- `index.js`: Updated to implement `calculate5G()`, $N_{RB}$ lookup, and dual-mode page routing.
- `mpr_limits_5g.json` / `mpr_limits_5g_data.js`: Added the newly parsed 5G NR band limits database.
- `README.md` / `GUIDE.md`: Updated user guides to include 5G NR FR1 parameters and specs.

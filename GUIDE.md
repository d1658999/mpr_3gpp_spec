# E-UTRA (LTE) MPR Limits Calculator - User Guide

This guide describes how to operate the calculator UI, configure parameters, interpret the visualizer gauge, and understand the automated footnote (Note 1, 2, 3) calculations.

---

## 📖 1. Interface Controls and Parameters

The control panel is divided into input fields:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **Verification Mode** | Selector | **Max Output Power (Clause 6.2.3)**: Computes standard transmitter test limits.<br>**Configured Power (Clause 6.2.5)**: Evaluates $P_{CMAX\_L}$ and $P_{CMAX\_H}$ limits including MPR. |
| **Operating Band** | Selector | Select the active E-UTRA band (1-88). Selecting a band adjusts the base tolerances, test tolerances (TT), and footnote applicability rules. |
| **Modulation** | Selector | Choose QPSK, 16QAM, 64QAM, or 256QAM. |
| **RB Allocation** | Selector | Choose **Partial** (Inner) or **Full** (Outer) allocation. (Disabled for 256QAM as the specification lists a single limit). |
| **Measured Output Power**| Input | Optional. Enter your transmitter measured power in dBm to check Pass/Fail margin. |

---

## 🛡️ 2. Spec Footnotes & Auto-Judgment Logic

The E-UTRA specification dictates that footnotes (Note 1, 2, 3) only apply to certain bands and configurations. The calculator dynamically scans the database for footnote support and renders state badges next to the options:

### Note 1 (Band-Edge Relaxation)
*   **What it does**: Decreases the Lower Specification Limit (LSL) by an additional **-1.5 dB** at frequency band edges.
*   **Auto-judgment**: If the selected band and configuration supports it (Footnote 1 in DB), the checkbox is enabled and shows `SUPPORTED` (Blue) or `ACTIVE` (Green). Otherwise, it is disabled and displays `N/A` (Gray).

### Note 2 (Configured Output Power Tolerances)
*   **What it does**: Relaxes configured maximum output power ($P_{CMAX}$) tolerances as target configured power declines. Mapped from **Table 6.2.5.3-1**:
    *   $21.0\text{ dBm} \le P \le 23.0\text{ dBm} \rightarrow \text{Core Tolerance} = \pm 2.0\text{ dB}$ (TT = 0.7 dB)
    *   $20.0\text{ dBm} \le P < 21.0\text{ dBm} \rightarrow \text{Core Tolerance} = \pm 2.5\text{ dB}$ (TT = 0.7 dB)
    *   $18.0\text{ dBm} \le P < 19.0\text{ dBm} \rightarrow \text{Core Tolerance} = \pm 4.0\text{ dB}$ (TT = 0.7 dB)
*   **Auto-judgment**: Applied automatically in **Clause 6.2.5 Mode** only to bands supporting it (Footnote 2 in DB). Standard bands without Note 2 maintain a constant, standard tolerance.

### Note 3 (B18/B26 Coexistence)
*   **What it does**: Decreases LSL by **-1.5 dB** for coexistence in the 815 - 818 MHz band.
*   **Auto-judgment**: The checkbox container only appears when operating in Band 18 or Band 26.

---

## 📊 3. Verification Workflow (Pass/Fail)

1.  **Select the Configuration**: e.g., Band 2, QPSK, Full RB.
2.  **Toggle Options**: If applicable, select "Note 1 (Band-Edge Relaxation)".
3.  **Inspect Conformance Limits**: Check the USL and LSL values displayed in the results cards.
4.  **Enter TX Power**: Under "Verify Measured Output Power", type your measured value (e.g., `21.5`).
5.  **Review the Status Bar**:
    *   **PASS (Green)**: Output power is within the USL/LSL margins. Displays exact margins.
    *   **FAIL (Red)**: Output power violates limits. Displays the violation margin.
6.  **Interpret the Gauge**:
    *   The **Green bar** spans the acceptable transmission window (LSL to USL).
    *   The **Nominal marker (yellow line)** shows the target class power (23.0 dBm).
    *   The **Measured marker (blue circle)** shows your entered TX power relative to the limits.

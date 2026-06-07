# 3GPP Transmitter MPR Limits Calculator - User Guide

This guide describes how to operate the calculator UI, configure parameters, interpret the visualizer gauge, and understand the automated footnote calculations for both 4G LTE and 5G NR FR1.

---

## 📖 1. Interface Controls and Parameters

### 📡 Radio Access Technology (RAT) Selection
Select between **E-UTRA (4G LTE)** and **5G NR FR1**. Selecting a RAT dynamically switches the inputs, databases, and calculations.

### ⚙️ Input Parameters

| Parameter | Supported in | Description |
| :--- | :--- | :--- |
| **Verification Mode** | LTE & 5G | **Max Output Power**: Computes standard transmitter test limits.<br>**Configured Power**: Evaluates configured UE power ($P_{CMAX}$) limits including MPR. |
| **UE Power Class** | 5G only | Choose **Class 3** (23 dBm), **Class 2** (26 dBm), or **Class 1** (31 dBm). Options are dynamically filtered depending on the selected band's capability. |
| **Operating Band** | LTE & 5G | Select the active band. LTE bands: 1 to 88. 5G bands: n1 to n110. |
| **Waveform Type** | 5G only | Choose **DFT-s-OFDM** (lower PAPR) or **CP-OFDM** (standard multi-carrier). |
| **Subcarrier Spacing** | 5G only | Select **15 kHz**, **30 kHz**, or **60 kHz**. |
| **Channel Bandwidth** | 5G only | Choose bandwidth (3 MHz to 100 MHz). This determines the transmission bandwidth configuration $N_{RB}$. |
| **Modulation Scheme**| LTE & 5G | Select modulation (QPSK to 256QAM, plus $\pi/2$ BPSK options on DFT-s-OFDM in 5G). |
| **RB Allocation Type**| LTE & 5G | **LTE**: Partial RB (Inner) or Full RB (Outer).<br>**5G**: Inner, Outer, or Edge RB Allocation. |
| **Edge Size ($L_{CRB}$)**| 5G only | Select **1 RB** or **2 RBs** (only visible for Edge RB allocation). Used in the PC1 Edge MPR formula. |
| **Measured Output Power**| LTE & 5G | Optional. Enter your transmitter measured power in dBm to check Pass/Fail margin. |

---

## 🛡️ 2. Spec Footnotes & Auto-Judgment Logic

The spec dictates that footnotes only apply to certain bands and configurations. The calculator dynamically handles this:

### 4G LTE Footnotes
*   **Note 1 (Band Edge)**: Lowers the LSL by **-1.5 dB** at band edges. Automatically enabled if the selected configuration supports it.
*   **Note 2 ($P_{CMAX}$ Tolerances)**: Automatically relaxes configured power tolerances based on Table 6.2.5.3-1 when active.
*   **Note 3 (B18/B26)**: Lowers LSL by **-1.5 dB** for coexistence in 815 - 818 MHz.

### 5G NR FR1 Footnotes
*   **Note 1 ($\pi/2$ BPSK Power Boosting)**:
    *   **Applicability**: PC3, DFT-s-OFDM, $\pi/2$ BPSK modulation on TDD bands n40, n41, n77, n78, n79.
    *   **Effect**: Increases the Nominal transmit power from 23 dBm to **26 dBm**! Changes MPR limits to Inner = 0.2 dB, Outer = 1.2 dB, Edge = 3.5 dB.
*   **Note 3 (Band Edge Relaxation)**:
    *   **Applicability**: PC3 band n24; PC2 bands n3, n5, n7, n8, n25, n28, n41.
    *   **Effect**: Lowers the LSL by **-1.5 dB** at band edges.
*   **$\Delta$MPR (Table 6.2.2.3-3)**:
    *   **Effect**: Automatically adds **+0.5 dB** MPR for n28 at 30/40 MHz, or **+1.0 dB** MPR for n40 at 100 MHz.
*   **PC1 Edge MPR Formula**:
    *   **Effect**: For PC1 bands other than n14, Edge MPR is dynamically calculated based on $L_{CRB} / N_{RB}$ following the standard formulas:
        *   Bandwidth $\le 50\text{ MHz}$: $\text{MPR} = \text{CEIL}(7.2 - 6 \cdot (L_{CRB} / N_{RB}), 0.5\text{ dB})$
        *   Bandwidth $> 50\text{ MHz}$: $\text{MPR} = \text{CEIL}(5.35 + 3.15 \cdot (L_{CRB} / N_{RB}), 0.5\text{ dB})$

---

## 📊 3. Verification Workflow (Pass/Fail)

1.  **Select Technology & Mode**: Toggle to LTE or 5G, and select MPR or PCMAX mode.
2.  **Configure Parameters**: Select the band, power class, modulation, and allocation.
3.  **Adjust Note Options**: If supported, Note 1 or Note 3 checkboxes will become available. Check them to activate the relaxation.
4.  **Enter TX Power**: Enter your measured power in dBm.
5.  **Review Pass/Fail**: The visualizer gauge will render:
    *   **Green bar**: Acceptable transmission window (LSL to USL).
    *   **Yellow marker**: Target nominal power class.
    *   **Blue marker**: Your measured TX power.
    *   **Status bar**: PASS (with margins) or FAIL (with violation details).

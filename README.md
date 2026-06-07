# 3GPP Transmitter MPR Limits Calculator (LTE & 5G NR)

A highly responsive, zero-dependency, and offline-first web application designed for RF design and test validation engineers to look up and calculate transmitter Maximum Power Reduction (MPR) limits according to:
*   **3GPP E-UTRA (4G LTE)**: **TS 36.521-1 (Clauses 6.2.3 and 6.2.5)**
*   **3GPP 5G NR FR1**: **TS 38.521-1 (Clauses 6.2.2 and 6.2.4)**

---

## 🚀 Key Features

*   **Dual-Technology Support**: Toggle seamlessly between **4G LTE** and **5G NR FR1**.
*   **Comprehensive Band Databases**:
    *   **LTE**: Mapped core parameters, tolerances, and allowed MPR limits for all 51 LTE operating bands.
    *   **5G NR FR1**: Includes all 49 operating bands (n1 to n110), base tolerances, frequency-range dependent test tolerances, and power class capabilities.
*   **Three Power Classes (5G NR)**: Supports **Power Class 1** (31 dBm), **Power Class 2** (26 dBm), and **Power Class 3** (23 dBm) with dynamic capability checks per band.
*   **Waveforms & RB Allocations (5G NR)**:
    *   Supports **DFT-s-OFDM** (including $\pi/2$ BPSK) and **CP-OFDM** waveforms.
    *   Supports **Inner**, **Outer**, and **Edge** RB allocations.
*   **Automated Footnote and Formula Judgment**:
    *   **LTE Note 1 & 3**: Applies band-edge and B18/B26 coexistence LSL relaxations.
    *   **5G Note 1 (Power Boosting)**: Dynamically handles TDD $\pi/2$ BPSK power boosting, scaling nominal power to 26 dBm for bands n40, n41, n77, n78, n79 under PC3.
    *   **5G Note 3 (Band Edge)**: Applies -1.5 dB LSL relaxation for supported band/power class combinations.
    *   **5G $\Delta$MPR**: Automatically computes and applies Table 6.2.2.3-3 $\Delta$MPR (0.5 dB for n28/30-40MHz, 1.0 dB for n40/100MHz).
    *   **5G PC1 Edge Formula**: Automatically evaluates the dynamic Edge allocation formula (`7.2 - 6*(L/N)` or `5.35 + 3.15*(L/N)`) based on SCS, Channel Bandwidth, and Edge size (1 or 2 RBs).
*   **Real-time Power Bar Gauge**: Interactive graphical visualizer showing allowed transmission margins (USL, Nominal, LSL) and pass/fail state for your measured transmitter power. Scales range dynamically based on active power class.
*   **100% Offline Capable**: Encapsulates the entire database as JS variables to bypass browser CORS constraints, allowing engineers to double-click `index.html` and use it on the lab bench without an internet connection.

---

## 📁 Project Structure

```bash
├── index.html            # Calculator User Interface structure
├── style.css             # Layout, responsive grids, and dark-mode styling
├── index.js              # Calculation, event-listeners, and UI controller logic
├── mpr_limits_data.js    # LTE database wrapped as a JS variable
├── mpr_limits_5g_data.js # 5G NR FR1 database wrapped as a JS variable
├── mpr_limits.json       # Original structured LTE JSON database (for reference)
├── mpr_limits_5g.json    # Original structured 5G JSON database (for reference)
├── README.md             # Project overview (this file)
└── GUIDE.md              # Detailed step-by-step user guide
```

---

## 🛠️ How to Run

1.  **Direct Execution (Offline)**:
    *   Simply double-click [index.html](file:///C:/Users/d1658/Documents/project/mpr_3gpp_spec/index.html) in your file system to open it in any web browser. No server, node packages, or internet access required.
2.  **Local Dev Server (Optional)**:
    *   If you wish to serve it locally, you can run:
        ```bash
        npx serve .
        ```
        And open `http://localhost:3000` in your browser.
